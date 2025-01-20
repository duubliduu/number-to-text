import { convertNumber, numberToText, Variation } from "./number-to-text";

describe("numberToText", () => {
  describe("number", () => {
    it.each([
      ["1", "yksi"],
      ["2", "kaksi"],
      ["10", "kymmenen"],
      ["21", "kaksikymmentäyksi"],
      ["121", "satakaksikymmentäyksi"],
      ["111", "satayksitoista"],
      ["1011", "tuhatyksitoista"],
      ["2024", "kaksituhattakaksikymmentäneljä"],
      ["12024", "kaksitoistatuhattakaksikymmentäneljä"],
      ["22024", "kaksikymmentäkaksituhattakaksikymmentäneljä"],
      ["122024", "satakaksikymmentäkaksituhattakaksikymmentäneljä"],
      ["522024", "viisisataakaksikymmentäkaksituhattakaksikymmentäneljä"],
      [
        "1231231",
        "miljoonakaksisataakolmekymmentäyksituhattakaksisataakolmekymmentäyksi",
      ],
      [
        "1522024",
        "miljoonaviisisataakaksikymmentäkaksituhattakaksikymmentäneljä",
      ],
      [
        "95678",
        "yhdeksänkymmentäviisituhattakuusisataaseitsemänkymmentäkahdeksan",
      ],
    ])('should return "%s" when the input is %s', (subject, expected) => {
      expect(numberToText(subject)).toBe(expected);
    });
    describe("order", () => {
      it.each([
        ["1.", "ensimmäinen"],
        ["2.", "toinen"],
        ["17.", "seitsemästoista"],
        ["20.", "kahdeskymmenes"],
        ["25.", "kahdeskymmenesviides"],
        ["30.", "kolmaskymmenes"],
        ["67.", "kuudeskymmenesseitsemäs"],
        ["187.", "sadaskahdeksaskymmenesseitsemäs"],
        ["1187.", "tuhannessadaskahdeksaskymmenesseitsemäs"],
      ])('should return "%s" when the input is %s', (subject, expected) => {
        expect(numberToText(subject)).toBe(expected);
      });
    });
  });
});
