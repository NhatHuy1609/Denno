namespace server.Helpers
{
    public class LexoRankCalculator
    {
        private const int ALPHABET_SIZE = 26;
        private const string START_POSITION = "aaa";
        private const string END_POSITION = "zzz";
        private const int TASK_FOR_PROJECT_LIMIT_TOTAL = 1000;

        public string GenerateInitialRank()
        {
            return START_POSITION;
        }

        public string GenerateNewRank(string previousRank = START_POSITION)
        {
            if (previousRank == END_POSITION)
            {
                throw new ArgumentException("Exceeds the END_POSITION");
            }

            var startPos = START_POSITION;
            var endPos = END_POSITION;

            var startCode = (int)startPos[0];
            var endCode = (int)endPos[0];
            var diffInOneSymbol = endCode - startCode;

            var totalDiff = diffInOneSymbol +
                        diffInOneSymbol * ALPHABET_SIZE +
                        diffInOneSymbol * ALPHABET_SIZE * ALPHABET_SIZE;

            var diffForOneItem = totalDiff / (TASK_FOR_PROJECT_LIMIT_TOTAL + 1);

            var diffForSymbols = new List<int>
            {
                diffForOneItem % ALPHABET_SIZE,
                (diffForOneItem / ALPHABET_SIZE) % ALPHABET_SIZE,
                (diffForOneItem / (int)Math.Pow(ALPHABET_SIZE, 2)) % ALPHABET_SIZE
            };

            var offset = 0;
            var newElementChars = new List<char>();
            for (int index = 0; index < 3; index++) 
            {
                var diffInSymbols = diffForSymbols[index];
                var newElementCode = (int)previousRank[2 - index] + diffInSymbols;

                if (offset != 0)
                {
                    newElementCode += 1;
                    offset = 0;
                }

                if (newElementCode > 'z')
                {
                    offset += 1;
                    newElementCode -= ALPHABET_SIZE;
                }

                newElementChars.Add((char)newElementCode);
            }

            newElementChars.Reverse();
            var newElement = new string(newElementChars.ToArray());

            return newElement;
        }

        public string GetRankBetween(string firstRank, string secondRank)
        {
            if (string.Compare(firstRank, secondRank) >= 0)
            {
                throw new ArgumentException($"First position must be lower than second. Got firstRank {firstRank} and second rank {secondRank}");
            }

            while (firstRank.Length != secondRank.Length)
            {
                if (firstRank.Length > secondRank.Length)
                {
                    secondRank += 'a';
                } else
                {
                    firstRank += "a";
                }
            }

            var firstPositionCodes = firstRank.Select(c => (int)c).ToList();
            var secondPositionCodes = secondRank.Select(c => (int)c).ToList();
            var difference = 0.0;

            for (var index = firstPositionCodes.Count; index >= 0; index--)
            {
                var firstCode = firstPositionCodes[index];
                var secondCode = secondPositionCodes[index];

                if (secondCode < firstCode)
                {
                    secondCode += ALPHABET_SIZE;
                    secondPositionCodes[index - 1] -= 1;
                }

                // X = y(0) + y(1) * size + y(2) * size^2 … y(n) * size^(n-1)
                // Based size is 26
                var powRes = Math.Pow(ALPHABET_SIZE, firstRank.Length - index - 1);
                difference += (secondCode - firstCode) * powRes;
            }

            string newElement;
            if (difference <= 1)
            {
                newElement = firstRank + (char)('a' + ALPHABET_SIZE / 2);
            }
            else
            {
                difference /= 2;
                var offset = 0;
                var newElementChars = new List<char>();

                for (var index = 0; index < firstRank.Length; index++)
                {
                    // X = Y / size^(n-1) % size
                    // Calculate difference in symbols for current position
                    var diffInSymbols = (int)(difference / Math.Pow(ALPHABET_SIZE, index)) % ALPHABET_SIZE;

                    var newElementCode = firstRank[secondRank.Length - index - 1] + diffInSymbols + offset;
                    offset = 0;

                    // Handle overflow past 'z'
                    if (newElementCode > 'z')
                    {
                        offset++;
                        newElementCode -= ALPHABET_SIZE;
                    }

                    newElementChars.Add((char)newElementCode);
                }

                newElementChars.Reverse();
                newElement = new string(newElementChars.ToArray());
            }
            
            return newElement;
        }
    }
}
