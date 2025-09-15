namespace server.Helpers
{
    public static class CardHelper
    {
        public static bool CalculateIsOverdue(DateTime? dueDate, bool isCompleted, DateTime? completeDate)
        {
            if (!dueDate.HasValue) return false;

            return isCompleted
                ? (completeDate.HasValue && completeDate.Value > dueDate.Value)
                : DateTime.UtcNow > dueDate.Value;
        }
    }
}
