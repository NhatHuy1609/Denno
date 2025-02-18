using System.Text.RegularExpressions;

namespace server.Helpers.LexoRank
{
    public class LexoRankCore
    {
        public string Value { get; }
        public string Bucket { get; }

        public LexoRankCore(string value, string bucket = "0")
        {
            if (!IsValidLexValue(value))
                throw new ArgumentException($"Invalid lex value \"{value}\"");

            if (!IsValidLexBucket(bucket))
                throw new ArgumentException($"Invalid lex bucket \"{bucket}\"");

            Value = value;
            Bucket = bucket;
        }

        public static LexoRankCore From(object lex)
        {
            if (lex is LexoRankCore lexoRank)
                return new LexoRankCore(lexoRank.Value, lexoRank.Bucket);

            var (value, bucket) = Parse(lex.ToString());
            return new LexoRankCore(value, bucket);
        }

        private static (string value, string bucket) Parse(string lex)
        {
            var regex = new Regex(@"^(?<bucket>[0-2])\|(?<value>[0-9a-z]*[1-9a-z])$");
            var match = regex.Match(lex);

            if (!match.Success)
                throw new ArgumentException("Invalid lex string");

            return (match.Groups["value"].Value, match.Groups["bucket"].Value);
        }

        public override string ToString()
        {
            return $"{Bucket}|{Value}";
        }

        public static string NextBucket(string bucket)
        {
            if (!IsValidLexBucket(bucket))
                throw new ArgumentException($"Invalid lex bucket \"{bucket}\"");

            return bucket == "2" ? "0" : ((char)(bucket[0] + 1)).ToString();
        }

        public static string PrevBucket(string bucket)
        {
            if (!IsValidLexBucket(bucket))
                throw new ArgumentException($"Invalid lex bucket \"{bucket}\"");

            return bucket == "0" ? "2" : ((char)(bucket[0] - 1)).ToString();
        }

        private static bool IsValidLexValue(string value)
        {
            return Regex.IsMatch(value, @"^[0-9a-z]*[1-9a-z]$");
        }

        private static bool IsValidLexBucket(string bucket)
        {
            return Regex.IsMatch(bucket, @"^[0-2]$");
        }

        public bool LessThan(object lex)
        {
            var other = From(lex);
            var len = Math.Max(Value.Length, other.Value.Length);

            for (var idx = 0; idx < len; idx++)
            {
                var charA = idx < Value.Length ? Value[idx] : '\0';
                var charB = idx < other.Value.Length ? other.Value[idx] : '\0';

                if (charB == '\0') return false; // a is more specific
                if (charA == '\0') return true;  // b is more specific

                if (charA < charB) return true;
                if (charA > charB) return false;
            }

            return false;
        }

        public LexoRankCore Increment()
        {
            for (var idx = Value.Length - 1; idx >= 0; idx--)
            {
                var c = Value[idx];
                if (c == 'z') continue;

                var newVal = Value.Substring(0, idx) + IncrementChar(c);
                return new LexoRankCore(newVal, Bucket);
            }

            var newValue = Value + "1";
            return new LexoRankCore(newValue, Bucket);
        }

        public LexoRankCore Decrement()
        {
            var length = Value.Length;
            var c = Value[length - 1];

            if (c != '1')
            {
                var newVal = Value.Substring(0, length - 1) + DecrementChar(c);
                return new LexoRankCore(newVal, Bucket);
            }

            if (HasNonZeroLeadingChars())
            {
                var newVal = CleanTrailingZeros(Value.Substring(0, length - 1));
                return new LexoRankCore(newVal, Bucket);
            }

            var newValue = "0" + Value;
            return new LexoRankCore(newValue, Bucket);
        }

        private bool HasNonZeroLeadingChars()
        {
            return Value.Length > 1 && !Regex.IsMatch(Value.Substring(0, Value.Length - 1), @"^0+$");
        }

        private static string CleanTrailingZeros(string str)
        {
            var regex = new Regex(@"^(?<value>[0-9a-z]*[1-9a-z])0*$");
            var match = regex.Match(str);

            if (!match.Success)
                throw new ArgumentException("Invalid lex string");

            return match.Groups["value"].Value;
        }

        private LexoRankCore Append(string str)
        {
            return new LexoRankCore(Value + str, Bucket);
        }

        private static string IncrementChar(char c)
        {
            if (c == 'z') return "-1";
            if (c == '9') return "a";

            return ((char)(c + 1)).ToString();
        }

        private static string DecrementChar(char c)
        {
            if (c == '1') return "-1";
            if (c == 'a') return "9";

            return ((char)(c - 1)).ToString();
        }

        public static LexoRankCore Between(object lexBefore, object lexAfter)
        {
            if (lexBefore == null && lexAfter == null)
                throw new ArgumentException("Only one argument may be null");

            if (lexAfter == null)
                return From(lexBefore).Increment();

            if (lexBefore == null)
                return From(lexAfter).Decrement();

            var before = From(lexBefore);
            var after = From(lexAfter);

            if (before.Bucket != after.Bucket)
                throw new ArgumentException("Lex buckets must be the same");

            if (!before.LessThan(after))
                throw new ArgumentException($"{before.Value} is not less than {after.Value}");

            var incremented = before.Increment();
            if (incremented.LessThan(after)) return incremented;

            var plus1 = before.Append("1");
            if (plus1.LessThan(after)) return plus1;

            var pre = "0";
            var plus01 = before.Append($"{pre}1");

            while (!plus01.LessThan(after))
            {
                pre += "0";
                plus01 = before.Append($"{pre}1");
            }

            return plus01;
        }
    }
}
