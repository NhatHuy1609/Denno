namespace server.Models.Results
{
    public class Result<T>
    {
        private readonly T _value;

        public Result(T value, bool isSuccess, Error error)
        {
            if (isSuccess && error != Error.None ||
                !isSuccess && error == Error.None)
            {
                throw new ArgumentException("Invalid error configuration", nameof(error));
            }

            IsSuccess = isSuccess;
            Error = error;
            _value = value;
        }

        public bool IsSuccess { get; }
        public bool IsFailure => !IsSuccess;
        public Error Error { get; }

        public T Value => IsSuccess
            ? _value!
            : throw new InvalidOperationException("Cannot access Value when Result is failure.");

        public static Result<T> Success(T value) => new(value, true, Error.None);
        public static Result<T> Failure(Error error) => new(default!, false, error);

        // Bind method allows chaining operations that return Result<U>
        public Result<U> Bind<U>(Func<T, Result<U>> func)
        {
            return IsSuccess 
                ? func(_value) 
                : Result<U>.Failure(Error);
        }

        // Map method: variable value, no state change
        public Result<U> Map<U>(Func<T, U> func)
        {
            return IsSuccess
                ? Result<U>.Success(func(_value))
                : Result<U>.Failure(Error);
        }

        // Switch method: execute different actions based on success or failure
        public void Switch(Action<T> onSuccess, Action<Error> onFailure)
        {
            if (IsSuccess)
            {
                onSuccess(_value);
            }
            else
            {
                onFailure(Error);
            }
        }

        // Combine method: combines multiple Result<T> into a single Result<List<T>>
        public static Result<List<T>> Combine(params Result<T>[] results)
        {
            var errors = results.Where(r => r.IsFailure).Select(r => r.Error).ToList();

            if (errors.Any())
            {
                return Result<List<T>>.Failure(errors.First());
            }

            var values = results.Select(r => r.Value).ToList();
            return Result<List<T>>.Success(values);
        }
    }
}
