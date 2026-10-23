import type { LegalTexts } from "./types";

export const fi: LegalTexts = {
  privacy: {
    title: "Tietosuojaseloste",
    intro: [
      "Tässä selosteessa kerromme, mitä henkilötietoja Skillseek kerää, miksi, kenen kanssa jaamme niitä ja mitä oikeuksia sinulla on. Skillseek on rakennusalan yrityksille ja ammattilaisille tarkoitettu palvelu, jota ylläpitää {company}.",
    ],
    sections: [
      {
        heading: "1. Rekisterinpitäjä",
        body: [
          "Henkilötietojesi rekisterinpitäjä on {company} (rekisterikoodi {regCode}), {address}. Tavoitat meidät kaikissa tähän selosteeseen liittyvissä asioissa osoitteesta {email}.",
        ],
      },
      {
        heading: "2. Mitä tietoja keräämme",
        body: [
          "Keräämme tiedot, jotka annat meille itse, sekä vähän teknisiä tietoja, joita palvelun toiminta edellyttää:",
          {
            list: [
              "Tilin tiedot: sähköpostiosoite, tiivistetty salasana (emme koskaan tallenna itse salasanaa), roolisi (pääurakoitsija, aliurakoitsija tai ammattilainen), kieli ja rekisteröitymispäivä.",
              "Profiilin tiedot: nimesi tai yhteyshenkilö, yrityksen nimi ja rekisterikoodi, kuvaus, puhelinnumero, verkkosivusto, maa ja palvelualueen maat, ammattialat, sertifikaatit, portfoliolinkit, kuvat, kokemusvuodet, tuntihinta ja saatavuus.",
              "Toimintatiedot: julkaisemasi työilmoitukset, hakemukset ja kutsut, muiden käyttäjien kanssa vaihtamasi viestit sekä kirjoittamasi ja saamasi arviot.",
              "Kirjautumistiedot: istuntotunnisteet ja kertakäyttöiset kirjautumislinkit. Kirjautumislinkeistä tallennamme vain tiivisteen, ja linkki vanhenee 20 minuutissa.",
              "Odotuslistan tiedot: jos liityt odotuslistalle ennen avaamista, sähköpostiosoitteesi, nimesi, roolisi, alueesi ja ammattialasi sekä halutessasi yrityksen nimi, rekisterikoodi, puhelinnumero, viesti meille ja linkki, jonka kautta tulit.",
              "Tekniset tiedot: IP-osoite, selaimen tyyppi ja pyyntölokit, jotka palveluntarjoajamme tallentaa palvelun turvallisuuden ja toimivuuden varmistamiseksi.",
            ],
          },
          "Emme käytä mainonta- tai analytiikkaseurantaa.",
        ],
      },
      {
        heading: "3. Miksi käytämme tietojasi ja millä oikeusperusteella",
        body: [
          {
            list: [
              "Tilisi luomiseen ja ylläpitoon, profiilisi näyttämiseen, sopivien ammattilaisten löytämiseen työilmoituksiin, viestien välittämiseen sekä kirjautumis- ja ilmoitussähköpostien lähettämiseen. Oikeusperuste: kanssasi tehdyn sopimuksen täytäntöönpano (yleisen tietosuoja-asetuksen 6 artiklan 1 kohdan b alakohta).",
              "Skillseekin turvallisuuden varmistamiseen, petosten ja väärinkäytösten estämiseen sekä sen tarkistamiseen, että yritykset ovat todellisia, esimerkiksi Viron kaupparekisteristä ja elinkeinotoiminnan rekisteristä (MTR). Oikeusperuste: oikeutettu etumme turvalliseen ja luotettavaan palveluun (6 artiklan 1 kohdan f alakohta).",
              "Yhteydenottoon Skillseekin beetaversiosta, jos liityt odotuslistalle. Oikeusperuste: suostumuksesi (6 artiklan 1 kohdan a alakohta), jonka voit peruuttaa milloin tahansa kirjoittamalla osoitteeseen {email}.",
              "Lakisääteisten velvoitteiden täyttämiseen, kuten kirjanpitosääntöjen noudattamiseen, jos alamme periä maksuja, tai viranomaisten lainmukaisiin pyyntöihin vastaamiseen. Oikeusperuste: lakisääteinen velvoite (6 artiklan 1 kohdan c alakohta).",
            ],
          },
          "Skillseek ehdottaa sopivia osumia kiinteiden sääntöjen perusteella ammattialojen, maiden, roolin ja saatavuuden mukaan. Ehdotuksilla ei ole sinuun kohdistuvia oikeusvaikutuksia, ja päätät aina itse, keneen otat yhteyttä tai kenet palkkaat.",
        ],
      },
      {
        heading: "4. Mitä muut käyttäjät ja yleisö näkevät",
        body: [
          "Skillseek on markkinapaikka, joten osa tiedoistasi on tarkoituksella näkyvissä:",
          {
            list: [
              "Profiilisi (puhelinnumeroa lukuun ottamatta), ammattialasi, kuvasi ja saamasi arviot näkyvät kaikille, myös kirjautumattomille vierailijoille, ja hakukoneet voivat indeksoida ne.",
              "Puhelinnumerosi näkyy vain kirjautuneille käyttäjille.",
              "Työilmoitukset näkyvät kaikille.",
              "Viestit näkyvät vain keskustelun osapuolille.",
            ],
          },
          "Lisää profiiliisi vain sellaista, minkä haluat näyttää julkisesti.",
        ],
      },
      {
        heading: "5. Julkisista rekistereistä kutsutut yritykset",
        body: [
          "Helpottaaksemme virolaisten rakennusyritysten aloittamista tuomme niiden tiedot ennen liittymistä Viron kaupparekisterin avoimesta datasta: toiminimi, rekisterikoodi, oikeudellinen muoto, tila, osoite, yrityksen rekisterissä julkaisema sähköpostiosoite, puhelinnumero ja verkkosivusto sekä toimialakoodit. Emme tuo yksityisiä elinkeinonharjoittajia (FIE), hallituksen jäseniä emmekä osakkaita.",
          "Näitä tietoja ei näytetä julkisesti. Käytämme niitä vain lähettääksemme yritykselle kertaluonteisen kutsun ottaa käyttöön näillä tiedoilla esitäytetty Skillseek-profiili. Oikeusperuste: oikeutettu etumme hyödyllisen markkinapaikan rakentamiseen (6 artiklan 1 kohdan f alakohta).",
          "Tuodut tiedot päivitetään rekisteristä jokaisen tuonnin yhteydessä, ja niitä säilytetään, kunnes yritys saa kutsun, kieltäytyy tai pyytää poistamaan ne. Jos yritys ei ole ottanut profiilia käyttöön 12 kuukauden kuluessa kutsusta, poistamme sen yhteystiedot ja osoitteen ja säilytämme vain nimen ja rekisterikoodin, jotta yritystä ei kutsuta enää uudelleen. Jokaisessa kutsussa on kieltäytymislinkki, joka tekee saman heti. Voit myös vastustaa käsittelyä tai pyytää poistamista kirjoittamalla osoitteeseen {email}.",
          "Sisältää tietoja Viron kaupparekisteristä (RIK), CC BY 4.0.",
        ],
      },
      {
        heading: "6. Palveluntarjoajat (alihankkijat)",
        body: [
          "Käytämme Skillseekin ylläpitoon seuraavia palveluntarjoajia. Ne käsittelevät tietoja vain ohjeidemme mukaisesti ja tietojenkäsittelysopimusten perusteella.",
          {
            table: {
              head: ["Palveluntarjoaja", "Tarkoitus", "Missä tietoja säilytetään"],
              rows: [
                ["Vercel Inc. (Yhdysvallat)", "Verkkosovelluksen ylläpito, pyyntölokit", "Sovelluspalvelimet Frankfurtissa, Saksassa; sisältö välitetään Vercelin maailmanlaajuisen verkon kautta"],
                ["Neon (Yhdysvallat)", "Tietokanta, jossa ovat kaikki tili-, profiili- ja toimintatiedot", "Frankfurt, Saksa (AWS eu-central-1)"],
                ["Resend (Yhdysvallat)", "Kirjautumis-, ilmoitus- ja odotuslistasähköpostien lähettäminen", "Yhdysvallat"],
                ["Cloudflare, Inc. (Yhdysvallat)", "Profiili- ja työkuvien tallennus (Cloudflare R2)", "Euroopan unioni (EU-lainkäyttöalueen säilö); kuvat välitetään Cloudflaren maailmanlaajuisen verkon kautta"],
              ],
            },
          },
          "Osa näistä palveluntarjoajista sijaitsee Yhdysvalloissa tai voi käsitellä tietoja Euroopan talousalueen ulkopuolelta. Tällöin siirrot suojataan EU:n ja Yhdysvaltojen välisellä tietosuojakehyksellä ja/tai Euroopan komission vakiosopimuslausekkeilla.",
        ],
      },
      {
        heading: "7. Kuinka kauan säilytämme tietoja",
        body: [
          {
            list: [
              "Tili-, profiili- ja toimintatiedot: niin kauan kuin tilisi on olemassa. Kun poistat tilisi, poistamme profiilisi, kuvasi, työilmoituksesi, hakemuksesi, viestisi sekä kirjoittamasi ja saamasi arviot.",
              "Odotuslistan tiedot: kunnes beetakutsut on lähetetty tai kunnes pyydät poistamaan ne.",
              "Istunnot: enintään 30 päivää tai uloskirjautumiseen asti.",
              "Kirjautumislinkit: vanhenevat 20 minuutissa ja poistetaan tilin mukana.",
              "Palvelin- ja sähköpostilokit: palvelin- ja sähköpostipalvelujen tarjoajamme (Vercel ja Resend) säilyttävät niitä tavanomaisen säilytysaikansa, joka on lyhyt, yleensä enintään 30 päivää.",
              "Tietokannan varmuuskopiot: poistetut tiedot voivat säilyä varmuuskopioissa enintään 30 päivää ennen kuin ne korvataan.",
              "Tiedot, jotka meidän on säilytettävä lain nojalla (esim. kirjanpitoaineisto), säilytämme lain edellyttämän ajan.",
            ],
          },
        ],
      },
      {
        heading: "8. Evästeet",
        body: [
          "Skillseek käyttää vain kahta evästettä, jotka molemmat ovat sivuston toiminnalle välttämättömiä, joten emme pyydä suostumusta:",
          {
            list: [
              "ss_session pitää sinut kirjautuneena. Se on voimassa enintään 30 päivää.",
              "locale muistaa valitsemasi kielen. Se on voimassa vuoden.",
            ],
          },
        ],
      },
      {
        heading: "9. Oikeutesi",
        body: [
          "Yleisen tietosuoja-asetuksen nojalla sinulla on oikeus:",
          {
            list: [
              "saada pääsy henkilötietoihisi ja saada niistä kopio;",
              "oikaista virheelliset tiedot (useimpia voit muokata itse profiilissasi);",
              "saada tietosi poistetuiksi;",
              "rajoittaa oikeutettuun etuumme perustuvaa käsittelyä tai vastustaa sitä;",
              "saada meille antamasi tiedot koneluettavassa muodossa (oikeus siirtää tiedot järjestelmästä toiseen).",
            ],
          },
          "Voit käyttää näitä oikeuksia, mukaan lukien tilisi poistaminen tai tietojesi vienti, kirjoittamalla osoitteeseen {email}. Jos tilisivullasi on siihen mahdollisuus, voit tehdä sen myös itse. Vastaamme kuukauden kuluessa.",
          "Sinulla on myös oikeus tehdä valitus Viron tietosuojavirastolle (Andmekaitse Inspektsioon, www.aki.ee) tai oman EU-maasi tietosuojaviranomaiselle, Suomessa tietosuojavaltuutetun toimistolle.",
        ],
      },
      {
        heading: "10. Tietoturva",
        body: [
          "Käytämme salattuja yhteyksiä (HTTPS), tallennamme salasanat vain bcrypt-tiivisteinä, pidämme kirjautumislinkit lyhytikäisinä ja säilytämme tiedot mahdollisuuksien mukaan EU:ssa toimivilla palveluntarjoajilla. Mikään järjestelmä ei ole täysin turvallinen, joten käytä vahvaa salasanaa ja pidä sähköpostitilisi turvassa.",
        ],
      },
      {
        heading: "11. Ikä",
        body: ["Skillseek on tarkoitettu vähintään 18-vuotiaille, jotka toimivat yrityksen puolesta tai ammatissaan. Emme tietoisesti kerää lasten tietoja."],
      },
      {
        heading: "12. Muutokset tähän selosteeseen",
        body: [
          "Päivitämme tätä selostetta, kun palvelu tai lainsäädäntö muuttuu. Merkittävistä muutoksista ilmoitamme sinulle sähköpostitse tai sovelluksessa ennen niiden voimaantuloa. Sivun yläosassa oleva päivämäärä kertoo, milloin selostetta on viimeksi päivitetty.",
        ],
      },
    ],
  },

  terms: {
    title: "Käyttöehdot",
    intro: [
      "Näitä ehtoja sovelletaan, kun käytät Skillseekiä, markkinapaikkaa, joka yhdistää rakennusalan pääurakoitsijat, aliurakoitsijat ja ammattilaiset. Lue ehdot ennen tilin luomista. Luomalla tilin hyväksyt nämä ehdot.",
    ],
    sections: [
      {
        heading: "1. Keitä olemme",
        body: [
          "Skillseekin omistaa ja sitä ylläpitää {company} (rekisterikoodi {regCode}), {address} (\"me\"). Tavoitat meidät osoitteesta {email}.",
        ],
      },
      {
        heading: "2. Kuka voi käyttää Skillseekiä",
        body: [
          "Skillseek on yritysten välinen palvelu. Voit käyttää sitä vain, jos olet vähintään 18-vuotias ja toimit yrityksen puolesta tai elinkeinossasi tai ammatissasi, esimerkiksi yksityisenä elinkeinonharjoittajana tai itsenäisenä ammattilaisena. Jos rekisteröidyt yrityksen puolesta, vahvistat, että sinulla on oikeus toimia sen puolesta.",
        ],
      },
      {
        heading: "3. Tilisi",
        body: [
          "Anna oikeat tiedot ja pidä ne ajan tasalla. Pidä salasanasi ja kirjautumissähköpostisi omana tietonasi; vastaat kaikesta, mitä tililläsi tapahtuu. Jos epäilet, että joku muu on päässyt tilillesi, ilmoita meille heti osoitteeseen {email}. Jokaisella henkilöllä tai yrityksellä saa olla vain yksi tili kutakin roolia kohden.",
        ],
      },
      {
        heading: "4. Mitä Skillseek tekee ja mitä ei",
        body: [
          "Skillseek auttaa sinua löytämään muita rakennusalan yrityksiä ja ammattilaisia, ottamaan heihin yhteyttä ja arvioimaan heitä. Emme ole osapuolena missään sopimuksessa, jonka teet toisen käyttäjän kanssa. Erityisesti:",
          {
            list: [
              "Emme ole työnantaja, henkilöstövuokrausyritys tai pääurakoitsija, emmekä valvo mitään työtä.",
              "Emme takaa minkään työn laatua, turvallisuutta, laillisuutta tai aikataulua, emmekä sitä, että käyttäjä maksaa tai täyttää velvoitteensa.",
              "\"Tarkistettu\"-merkki tarkoittaa vain, että olemme tarkistaneet yrityksen olemassaolon julkisesta rekisteristä. Se ei ole suositus eikä taitojen, lupien, vakuutusten tai maksukyvyn tarkistus.",
              "Osumaehdotukset luodaan automaattisesti, eivätkä ne välttämättä ole kattavia.",
            ],
          },
          "Tee omat tarkistuksesi ennen kuin palkkaat jonkun tai sitoudut työhön, ja sovi ehdoista toisen osapuolen kanssa kirjallisesti.",
        ],
      },
      {
        heading: "5. Vastuusi",
        body: [
          "Vastaat siitä, että noudatat työssäsi lakia, mukaan lukien:",
          {
            list: [
              "työsi edellyttämät rekisteröinnit, pätevyydet ja sertifikaatit, kuten rekisteröinti Viron elinkeinotoiminnan rekisteriin (MTR) tai vastaavaan rekisteriin, kun sitä vaaditaan;",
              "työ-, vero-, työturvallisuus- ja rakentamismääräykset;",
              "kaiken julkaisemasi, kuten työilmoitusten, hintojen ja sertifikaattien, paikkansapitävyys.",
            ],
          },
        ],
      },
      {
        heading: "6. Sisältösi",
        body: [
          "Lisäämäsi sisältö, kuten profiili, kuvat, työilmoitukset, viestit ja arviot, pysyy sinun omaisuutenasi. Annat meille ei-yksinomaisen, maksuttoman ja maailmanlaajuisen käyttöoikeuden säilyttää, näyttää ja jakaa tätä sisältöä Skillseekissä ja näyttää sen julkisia osia (kuten profiileja ja työilmoituksia) avoimessa verkossa niin kauan kuin sisältö on palvelussa. Vahvistat, että sinulla on oikeus julkaista sisältö ja että kuvissa ei ole ihmisiä, jotka eivät ole antaneet siihen lupaa.",
        ],
      },
      {
        heading: "7. Arviot",
        body: [
          "Arvioiden on oltava rehellisiä ja perustuttava Skillseekin kautta tehtyyn todelliseen työhön, eivätkä ne saa sisältää loukkauksia, muiden henkilötietoja tai luottamuksellisia tietoja. Voimme poistaa ehtoja rikkovat arviot, mutta emme muokkaa niiden sisältöä.",
        ],
      },
      {
        heading: "8. Mitä et saa tehdä",
        body: [
          {
            list: [
              "julkaista väärää, harhaanjohtavaa tai laitonta sisältöä tai esiintyä toisena henkilönä;",
              "lähettää roskapostia tai käyttää Skillseekin tietoja muuhun markkinointiin;",
              "häiritä, syrjiä tai uhkailla muita käyttäjiä;",
              "tarjota pimeää työtä tai mitään, mikä rikkoo työ- tai verolainsäädäntöä;",
              "kerätä tietoja automaattisesti, kopioida niitä massana tai häiritä palvelua tai sen turvallisuutta;",
              "käyttää Skillseekiä maksujemme kiertämiseen, kun maksut ovat käytössä.",
            ],
          },
        ],
      },
      {
        heading: "9. Maksut",
        body: [
          "Skillseek on beetavaiheen ajan maksuton. Jos otamme käyttöön maksuja, ilmoitamme siitä vähintään 30 päivää etukäteen, eikä sinulta veloiteta mitään, mitä et ole hyväksynyt.",
        ],
      },
      {
        heading: "10. Tilin jäädyttäminen ja päättäminen",
        body: [
          "Voit lopettaa Skillseekin käytön ja poistaa tilisi milloin tahansa. Voimme poistaa sisältöä tai jäädyttää tai sulkea tilin, jos se rikkoo näitä ehtoja tai lakia tai vaarantaa muita käyttäjiä. Kun se on kohtuullista, kerromme syyn ja annamme sinulle mahdollisuuden vastata.",
        ],
      },
      {
        heading: "11. Saatavuus ja muutokset",
        body: [
          "Skillseek on beetavaiheessa. Pyrimme pitämään palvelun toiminnassa, mutta se voi ajoittain olla poissa käytöstä, ja voimme muuttaa, lisätä tai poistaa ominaisuuksia.",
        ],
      },
      {
        heading: "12. Vastuunrajoitus",
        body: [
          "Tarjoamme Skillseekin \"sellaisenaan\". Emme vastaa muiden käyttäjien teoista tai laiminlyönneistä, käyttäjien välisistä sopimuksista emmekä välillisistä vahingoista, kuten saamatta jääneestä voitosta tai menetetyistä sopimuksista. Kokonaisvastuumme sinulle rajoittuu suurempaan seuraavista: 100 euroa tai maksut, jotka olet maksanut meille vaatimusta edeltäneiden 12 kuukauden aikana. Rajoitukset eivät koske tilanteita, joissa laki ei niitä salli, mukaan lukien tahallisesti tai törkeällä huolimattomuudella aiheutettu vahinko.",
        ],
      },
      {
        heading: "13. Muutokset näihin ehtoihin",
        body: [
          "Voimme päivittää näitä ehtoja. Ilmoitamme merkittävistä muutoksista sähköpostitse tai sovelluksessa vähintään 14 päivää ennen niiden voimaantuloa. Jos jatkat Skillseekin käyttöä sen jälkeen, uudet ehdot ovat voimassa. Jos et hyväksy niitä, voit poistaa tilisi.",
        ],
      },
      {
        heading: "14. Sovellettava laki ja riidat",
        body: [
          "Näihin ehtoihin sovelletaan Viron tasavallan lakia. Pyrimme ensin ratkaisemaan mahdolliset riidat kanssasi sovinnollisesti. Ratkaisematta jääneet riidat ratkaistaan Harjun maakunnan käräjäoikeudessa (Harju Maakohus), ellei pakottava laki anna sinulle oikeutta kääntyä muun tuomioistuimen puoleen.",
        ],
      },
      {
        heading: "15. Yhteystiedot",
        body: ["Kysymykset näistä ehdoista: {email}. Henkilötietojen käsittelystä kerrotaan tietosuojaselosteessamme."],
      },
    ],
  },
};
