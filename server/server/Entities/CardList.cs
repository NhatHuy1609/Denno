﻿namespace server.Entities
{
    public class CardList
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Rank { get; set; }

        public Guid BoardId { get; set; }
        public Board Board { get; set; }

        public virtual ICollection<Card> Cards { get; set; } = new List<Card>();
    }
}
