﻿using System.Net;
using Application.DTOs;
using Application.Extensions;
using Application.Interfaces;
using Domain.Entities;
using Domain.enums;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Moq;
using TypingGame.Presentation;
using TypingGame.Presentation.Hubs;
using TypingGame.Shared.Constants.Messages;
using Xunit.Abstractions;

namespace TypingGame.Test.GameHubTest
{
    [Collection("IntegrationTest")]
    public class CreateRoomTest
    {
        private readonly HubConnection _connection;
        private readonly Utils _utils;
        private readonly string _methodName = nameof(GameHub.CreateRoom);

        private readonly ITestOutputHelper _output;

        public CreateRoomTest(TestStartup testStartup, ITestOutputHelper testOutputHelper)
        {
            var builderService = testStartup.Services.BuildServiceProvider();

            _connection = builderService.GetRequiredService<HubConnection>();
            _output = testOutputHelper;
            _utils = builderService.GetRequiredService<Utils>();
        }

        [Fact]
        public async Task CreateRoom_Success()
        {
            string roomName = "Room1";
            string roomTextType = RoomTextType.Javascript.ToString();

            var roomNameReceived = "";
            _connection.On<RoomDTO>(
                "CreateRoom",
                o =>
                {
                    roomNameReceived = o.Name;
                }
            );

            var user = await _utils.Login(_connection);
            var response = await _connection.InvokeAsync<SocketResponseDTO<RoomDTO?>>(
                _methodName,
                user.UserName,
                roomName,
                roomTextType
            );

            _output.WriteLine("response '{0}'", response.Data?.Name);
            Assert.Equal((int)HttpStatusCode.OK, response.Code);
            Assert.Equal(ResponseMessages.RoomCreated, response.Message);
            Assert.Equal("Room1", response.Data?.Name ?? "");

            await Task.Delay(200);
            Assert.Equal(roomName, roomNameReceived);
        }

        [Fact]
        public async Task CreateRoomUnhautorizedUser_Return404()
        {
            string roomName = "Room1";
            string roomTextType = RoomTextType.Javascript.ToString();
            string userName = "userCreateRoom";

            var response = await _connection.InvokeAsync<SocketResponseDTO<RoomDTO?>>(
                _methodName,
                userName,
                roomName,
                roomTextType
            );

            _output.WriteLine("response '{0}'", response.Code);
            Assert.Equal((int)HttpStatusCode.NotFound, response.Code);
            Assert.Equal(ResponseMessages.UserNotExist, response.Message);
            Assert.Null(response.Data);
        }

        [Fact]
        public async Task CreateRoom_SendsMessagesToAllClients()
        {
            Room room = new Room("roomName", RoomTextType.Javascript.ToString());
            var roomDTO = room.AsDto();
            string connectionId = "connectionId";
            var mockGameHubServices = new Mock<IGameServices>();
            var mockLogger = new Mock<ILogger<GameHub>>();
            var mockGroupManager = new Mock<IGroupManager>();
            var mockClients = new Mock<IHubCallerClients>();
            var mockClientService = new Mock<IClientHubMessages>();

            var context = new Mock<HubCallerContext>();
            context.Setup(c => c.ConnectionId).Returns(connectionId);

            mockGameHubServices
                .Setup(s =>
                    s.CreateRoom(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>())
                )
                .ReturnsAsync(roomDTO);

            var gameHub = new GameHub(
                mockGameHubServices.Object,
                mockLogger.Object,
                mockClientService.Object
            )
            {
                Clients = mockClients.Object,
                Groups = mockGroupManager.Object,
                Context = context.Object,
            };

            // Act
            var result = await gameHub.CreateRoom("userName", roomDTO.Name, roomDTO.RoomType);

            // Assert
            mockGameHubServices.Verify(
                s => s.CreateRoom("userName", roomDTO.Name, roomDTO.RoomType),
                Times.Once
            );
            mockGroupManager.Verify(
                g => g.AddToGroupAsync(connectionId, roomDTO.Id, default),
                Times.Once
            );
            mockClientService.Verify(c => c.CreateRoom(roomDTO), Times.Once);
        }
    }
}
