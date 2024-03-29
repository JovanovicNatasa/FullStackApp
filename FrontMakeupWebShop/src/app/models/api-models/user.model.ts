export interface User {
  korisnikId:number;
  ime: string;
  prezime: string;
  jmbg: string;
  email: string;
  kontakt: string;
  username: string;
  lozinka: string;
  brojKupovina:number;
  ulogaId:number;
  adresa: {
    adresaId: number;
    grad: string;
    ulica: string;
    broj: string;
    postanskiBroj: number;
  };
}
