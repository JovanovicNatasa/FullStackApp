﻿namespace MakeupWebShop.Models.DTO
{
    public class UpdateRacunRequest
    {
        public DateTime DatumKupovine { get; set; }

        public TimeSpan VremeKupovine { get; set; }

        public decimal IznosPost { get; set; }

        public decimal IznosSaPost { get; set; }

        public decimal? IznosPopusta { get; set; }

        public decimal IznosSaPopustom { get; set; }

        public int KorpaId { get; set; }

        public string? ClientSecret { get; set; }
        public string? PaymentIntentId { get; set; }
    }
}
