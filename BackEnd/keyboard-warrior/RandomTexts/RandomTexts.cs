namespace keyboard_warrior.Texts
{
    public  class RandomTexts
    {
        private List<string> texts = new();

        public RandomTexts()
        {/*
            texts.Add("Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas molestiae, animi recusandae enim ipsum beatae quam perspiciatis corrupti delectus saepe odio placeat facilis quisquam facere cum impedit officia rem voluptatem!");
            texts.Add("I have a dream that one day this nation will rise up and live out the true meaning of its creed: We hold these truths to be self-evident, that all men are created equal.");
            texts.Add("It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.");
            texts.Add("I have a dream that one day on the red hills of Georgia, the sons of former slaves and the sons of former slave owners will be able to sit down together at the table of brotherhood.");
            texts.Add("Two roads diverged in a wood, and I took the one less traveled by, And that has made all the difference.");
            texts.Add("The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle. As with all matters of the heart, you'll know when you find it.");
            texts.Add("For beautiful eyes, look for the good in others; for beautiful lips, speak only words of kindness; and for poise, walk with the knowledge that you are never alone.");*/

            texts.Add("is qptatem!");
            texts.Add("all men are created equal.");
            texts.Add("function prueba(){\n   const hola = 3;\n   const tres = 4;\n   return hola + tres;\n }");
            texts.Add("function prueba(){\n   const hola = 3;\n   const tres = 4;\n   return hola + tres;\n }");
   

        }

        public string GetRandomText()
        {
            Random random = new();
            int index = random.Next(0, texts.Count); // Generar un índice aleatorio
            return texts[index]; // Devolver el texto en el índice aleatorio
        }

    }
}
