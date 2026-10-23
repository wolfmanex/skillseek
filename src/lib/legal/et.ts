import type { LegalTexts } from "./types";

export const et: LegalTexts = {
  privacy: {
    title: "Privaatsuspoliitika",
    intro: [
      "Selles poliitikas selgitame, milliseid isikuandmeid Skillseek kogub, miks, kellega neid jagame ja millised õigused sul on. Skillseek on ehitusettevõtetele ja -spetsialistidele mõeldud teenus, mida pakub {company}.",
    ],
    sections: [
      {
        heading: "1. Kes vastutab sinu andmete eest",
        body: [
          "Sinu isikuandmete vastutav töötleja on {company} (registrikood {regCode}), {address}. Kõigis selle poliitikaga seotud küsimustes saad meiega ühendust aadressil {email}.",
        ],
      },
      {
        heading: "2. Milliseid andmeid kogume",
        body: [
          "Kogume andmeid, mille sa ise meile annad, ja vähesel määral tehnilisi andmeid, mida teenuse toimimiseks vajame:",
          {
            list: [
              "Konto andmed: e-posti aadress, räsitud parool (parooli ennast me kunagi ei salvesta), sinu roll (peatöövõtja, alltöövõtja või spetsialist), keel ja registreerumise kuupäev.",
              "Profiili andmed: sinu nimi või kontaktisik, ettevõtte nimi ja registrikood, kirjeldus, telefoninumber, veebileht, riik ja teeninduspiirkonna riigid, erialad, sertifikaadid, portfoolio lingid, fotod, kogemusaastad, tunnihind ja saadavus.",
              "Tegevuse andmed: sinu avaldatud tööpakkumised, kandideerimised ja kutsed, teiste kasutajatega vahetatud sõnumid ning sinu kirjutatud ja saadud arvustused.",
              "Sisselogimise andmed: seansi tunnused ja ühekordsed sisselogimislingid. Igast sisselogimislingist salvestame ainult räsi ja link aegub 20 minutiga.",
              "Ootenimekirja andmed: kui liitud enne avamist ootenimekirjaga, sinu e-posti aadress, nimi, roll, piirkond ja erialad ning soovi korral ettevõtte nimi, registrikood, telefoninumber, sõnum meile ja link, mille kaudu meieni jõudsid.",
              "Tehnilised andmed: IP-aadress, brauseri tüüp ja päringulogid, mida meie majutusteenuse pakkuja salvestab teenuse turvalisuse ja toimimise tagamiseks.",
            ],
          },
          "Me ei kasuta reklaami- ega analüütikajälgijaid.",
        ],
      },
      {
        heading: "3. Miks me sinu andmeid kasutame ja mis õiguslikul alusel",
        body: [
          {
            list: [
              "Konto loomiseks ja haldamiseks, sinu profiili näitamiseks, tööpakkumistele sobivate spetsialistide leidmiseks, sõnumite edastamiseks ning sisselogimis- ja teavituskirjade saatmiseks. Õiguslik alus: sinuga sõlmitud lepingu täitmine (isikuandmete kaitse üldmääruse artikli 6 lõike 1 punkt b).",
              "Skillseeki turvalisuse tagamiseks, pettuste ja kuritarvituste ennetamiseks ning ettevõtete olemasolu kontrollimiseks, näiteks äriregistrist ja majandustegevuse registrist (MTR). Õiguslik alus: meie õigustatud huvi turvalise ja usaldusväärse keskkonna vastu (artikli 6 lõike 1 punkt f).",
              "Sinuga Skillseeki beetaversiooni osas ühenduse võtmiseks, kui liitud ootenimekirjaga. Õiguslik alus: sinu nõusolek (artikli 6 lõike 1 punkt a), mille saad igal ajal tagasi võtta, kirjutades aadressil {email}.",
              "Seadusest tulenevate kohustuste täitmiseks, näiteks raamatupidamisnõuete täitmiseks, kui hakkame tasu võtma, või ametiasutuste seaduslikele päringutele vastamiseks. Õiguslik alus: juriidiline kohustus (artikli 6 lõike 1 punkt c).",
            ],
          },
          "Skillseek soovitab sobivaid vasteid kindlate reeglite alusel, lähtudes erialadest, riikidest, rollist ja saadavusest. Need soovitused ei too sulle kaasa õiguslikke tagajärgi ja sina otsustad alati ise, kellega ühendust võtta või keda tööle võtta.",
        ],
      },
      {
        heading: "4. Mida näevad teised kasutajad ja avalikkus",
        body: [
          "Skillseek on turuplats, seega on osa sinu andmetest teadlikult nähtavad:",
          {
            list: [
              "Sinu profiil (v.a telefoninumber), erialad, fotod ja saadud arvustused on nähtavad kõigile, ka sisse logimata külastajatele, ning otsingumootorid võivad need indekseerida.",
              "Sinu telefoninumbrit näevad ainult sisse loginud kasutajad.",
              "Tööpakkumised on nähtavad kõigile.",
              "Sõnumeid näevad ainult vestluse osalised.",
            ],
          },
          "Lisa oma profiilile ainult see, mida oled valmis avalikult näitama.",
        ],
      },
      {
        heading: "5. Avalikest registritest kutsutud ettevõtted",
        body: [
          "Et Eesti ehitusettevõtetel oleks lihtsam alustada, impordime nende andmed enne liitumist äriregistri avaandmetest: ärinimi, registrikood, õiguslik vorm, staatus, aadress, ettevõtte poolt registris avaldatud e-posti aadress, telefoninumber ja veebileht ning tegevusalade koodid. Me ei impordi füüsilisest isikust ettevõtjaid (FIE), juhatuse liikmeid ega osanikke.",
          "Neid andmeid ei näidata avalikult. Kasutame neid ainult selleks, et saata ettevõttele ühekordne kutse võtta enda nimele nende andmetega eeltäidetud Skillseeki profiil. Õiguslik alus: meie õigustatud huvi luua kasulik turuplats (artikli 6 lõike 1 punkt f).",
          "Imporditud andmeid uuendatakse registrist iga impordi käigus ja neid säilitatakse, kuni ettevõte saab kutse, sellest loobub või palub andmed kustutada. Kui ettevõte ei ole 12 kuu jooksul pärast kutset profiili enda nimele võtnud, kustutame selle kontaktandmed ja aadressi ning jätame alles ainult nime ja registrikoodi, et ettevõtet enam kunagi uuesti ei kutsutaks. Igas kutses on loobumislink, mis teeb sama kohe. Vastuväite või kustutamistaotluse võid esitada ka aadressil {email}.",
          "Sisaldab andmeid Eesti äriregistrist (RIK), CC BY 4.0.",
        ],
      },
      {
        heading: "6. Teenusepakkujad (volitatud töötlejad)",
        body: [
          "Skillseeki käitamiseks kasutame järgmisi teenusepakkujaid. Nad töötlevad andmeid ainult meie juhiste järgi ja andmetöötluslepingute alusel.",
          {
            table: {
              head: ["Teenusepakkuja", "Eesmärk", "Kus andmeid hoitakse"],
              rows: [
                ["Vercel Inc. (USA)", "Veebirakenduse majutus, päringulogid", "Rakenduse serverid Frankfurdis, Saksamaal; sisu edastatakse Verceli ülemaailmse võrgu kaudu"],
                ["Neon (USA)", "Andmebaas kõigi konto-, profiili- ja tegevuse andmetega", "Frankfurt, Saksamaa (AWS eu-central-1)"],
                ["Resend (USA)", "Sisselogimis-, teavitus- ja ootenimekirja kirjade saatmine", "Ameerika Ühendriigid"],
                ["Cloudflare, Inc. (USA)", "Profiili- ja tööfotode hoidmine (Cloudflare R2)", "Euroopa Liit (EL-i jurisdiktsiooniga hoidla); fotosid edastatakse Cloudflare'i ülemaailmse võrgu kaudu"],
              ],
            },
          },
          "Mõned neist teenusepakkujatest asuvad Ameerika Ühendriikides või võivad andmetele ligi pääseda väljastpoolt Euroopa Majanduspiirkonda. Sellisel juhul kaitsevad andmete edastamist ELi ja USA andmekaitseraamistik ja/või Euroopa Komisjoni tüüptingimused.",
        ],
      },
      {
        heading: "7. Kui kaua me andmeid säilitame",
        body: [
          {
            list: [
              "Konto-, profiili- ja tegevuse andmed: seni, kuni sinu konto on olemas. Konto kustutamisel kustutame sinu profiili, fotod, tööpakkumised, kandideerimised, sõnumid ning sinu kirjutatud ja saadud arvustused.",
              "Ootenimekirja kirjed: kuni beetakutsed on saadetud või kuni palud need kustutada.",
              "Seansid: kuni 30 päeva või kuni välja logimiseni.",
              "Sisselogimislingid: aeguvad 20 minutiga ja kustutatakse koos kontoga.",
              "Serveri- ja e-kirjade logid: majutus- ja e-posti teenuse pakkujad (Vercel ja Resend) hoiavad neid oma tavapärase säilitusaja jooksul, mis on lühike, tavaliselt mitte üle 30 päeva.",
              "Andmebaasi varukoopiad: kustutatud andmed võivad varukoopiates säilida kuni 30 päeva, enne kui need üle kirjutatakse.",
              "Andmeid, mida peame seaduse järgi säilitama (nt raamatupidamisdokumendid), hoiame seadusega nõutud aja.",
            ],
          },
        ],
      },
      {
        heading: "8. Küpsised",
        body: [
          "Skillseek kasutab ainult kahte küpsist, mis on mõlemad saidi toimimiseks vajalikud, seega me nõusolekut ei küsi:",
          {
            list: [
              "ss_session hoiab sind sisse logituna. See kehtib kuni 30 päeva.",
              "locale jätab meelde sinu valitud keele. See kehtib ühe aasta.",
            ],
          },
        ],
      },
      {
        heading: "9. Sinu õigused",
        body: [
          "Isikuandmete kaitse üldmääruse alusel on sul õigus:",
          {
            list: [
              "tutvuda oma isikuandmetega ja saada neist koopia;",
              "lasta parandada ebatäpseid andmeid (enamikku saad oma profiilis ise muuta);",
              "lasta oma andmed kustutada;",
              "piirata meie õigustatud huvil põhinevat töötlemist või esitada sellele vastuväide;",
              "saada meile antud andmed masinloetavas vormingus (andmete ülekandmise õigus).",
            ],
          },
          "Nende õiguste kasutamiseks, sealhulgas konto kustutamiseks või andmete eksportimiseks, kirjuta aadressil {email}. Kui sinu kontolehel on selleks võimalus, saad seda teha ka ise. Vastame ühe kuu jooksul.",
          "Sul on ka õigus esitada kaebus Andmekaitse Inspektsioonile (www.aki.ee) või oma ELi riigi andmekaitseasutusele.",
        ],
      },
      {
        heading: "10. Turvalisus",
        body: [
          "Kasutame krüpteeritud ühendusi (HTTPS), salvestame paroolid ainult bcrypt-räsidena, hoiame sisselogimislingid lühiajalistena ja hoiame andmeid võimaluse korral ELis asuvate teenusepakkujate juures. Ükski süsteem pole täiesti turvaline, seega kasuta tugevat parooli ja hoia oma e-posti konto turvalisena.",
        ],
      },
      {
        heading: "11. Vanus",
        body: ["Skillseek on mõeldud vähemalt 18-aastastele inimestele, kes tegutsevad ettevõtte nimel või oma kutsealal. Me ei kogu teadlikult laste andmeid."],
      },
      {
        heading: "12. Poliitika muudatused",
        body: [
          "Uuendame seda poliitikat, kui teenus või seadus muutub. Olulisest muudatusest teatame sulle enne selle jõustumist e-posti teel või rakenduses. Lehe ülaosas olev kuupäev näitab, millal poliitikat viimati uuendati.",
        ],
      },
    ],
  },

  terms: {
    title: "Kasutustingimused",
    intro: [
      "Need tingimused kehtivad Skillseeki kasutamisel. Skillseek on turuplats, mis viib kokku ehitusvaldkonna peatöövõtjad, alltöövõtjad ja oskustöölised. Palun loe tingimused enne konto loomist läbi. Konto luues nõustud nende tingimustega.",
    ],
    sections: [
      {
        heading: "1. Kes me oleme",
        body: [
          "Skillseeki omanik ja haldaja on {company} (registrikood {regCode}), {address} („meie“). Meiega saab ühendust aadressil {email}.",
        ],
      },
      {
        heading: "2. Kes saab Skillseeki kasutada",
        body: [
          "Skillseek on ettevõtetevaheline teenus. Võid seda kasutada ainult siis, kui oled vähemalt 18-aastane ja tegutsed ettevõtte nimel või oma ameti- või kutsealal, näiteks füüsilisest isikust ettevõtja (FIE) või iseseisvalt töötava spetsialistina. Kui registreerud ettevõtte nimel, kinnitad, et sul on õigus selle nimel tegutseda.",
        ],
      },
      {
        heading: "3. Sinu konto",
        body: [
          "Esita õiged andmed ja hoia need ajakohasena. Hoia oma parool ja sisselogimiskirjad enda teada; vastutad kõige eest, mis sinu kontol toimub. Kui arvad, et keegi teine on su kontole ligi pääsenud, anna meile kohe teada aadressil {email}. Igal inimesel või ettevõttel peaks olema iga rolli kohta ainult üks konto.",
        ],
      },
      {
        heading: "4. Mida Skillseek teeb ja mida mitte",
        body: [
          "Skillseek aitab sul leida teisi ehitusettevõtteid ja -spetsialiste, nendega ühendust võtta ja neid hinnata. Me ei ole ühegi sinu ja teise kasutaja vahel sõlmitud kokkuleppe osapool. Eelkõige:",
          {
            list: [
              "Me ei ole tööandja, renditööjõu vahendaja ega peatöövõtja ning me ei juhenda ega jälgi ühtegi tööd.",
              "Me ei taga ühegi töö kvaliteeti, ohutust, seaduslikkust ega õigeaegsust ega seda, et mõni kasutaja maksab või oma kohustused täidab.",
              "Märk „kontrollitud“ tähendab ainult seda, et kontrollisime ettevõtte olemasolu avalikus registris. See ei ole soovitus ega oskuste, tegevuslubade, kindlustuse või maksevõime kontroll.",
              "Sobivuse soovitused luuakse automaatselt ja need ei pruugi olla täielikud.",
            ],
          },
          "Enne kellegi tööle võtmist või tööga nõustumist tee ise vajalikud kontrollid ja lepi tingimustes teise osapoolega kirjalikult kokku.",
        ],
      },
      {
        heading: "5. Sinu kohustused",
        body: [
          "Vastutad oma töös seaduste järgimise eest, sealhulgas:",
          {
            list: [
              "sinu tööks vajalike registreeringute, kvalifikatsioonide ja sertifikaatide olemasolu eest, näiteks registreering majandustegevuse registris (MTR), kui see on nõutud;",
              "töö-, maksu-, töötervishoiu- ja tööohutus- ning ehitusnõuete täitmise eest;",
              "kõige sinu avaldatu, sealhulgas tööpakkumiste, hindade ja sertifikaatide õigsuse eest.",
            ],
          },
        ],
      },
      {
        heading: "6. Sinu sisu",
        body: [
          "Sinu lisatud sisu, näiteks profiil, fotod, tööpakkumised, sõnumid ja arvustused, jääb sinu omandisse. Annad meile lihtlitsentsi, tasuta ja kogu maailmas, et seda sisu Skillseekis majutada, kuvada ja jagada ning selle avalikke osi (nt profiile ja tööpakkumisi) avalikus veebis näidata seni, kuni sisu on teenuses olemas. Kinnitad, et sul on õigus see sisu avaldada ja et fotodel ei ole inimesi, kes pole selleks nõusolekut andnud.",
        ],
      },
      {
        heading: "7. Arvustused",
        body: [
          "Arvustused peavad olema ausad ja põhinema Skillseeki kaudu tehtud tegelikul tööl ega tohi sisaldada solvanguid, teiste isikuandmeid ega konfidentsiaalset teavet. Võime tingimusi rikkuvad arvustused eemaldada, kuid me ei muuda nende sisu.",
        ],
      },
      {
        heading: "8. Mida teha ei tohi",
        body: [
          {
            list: [
              "avaldada valet, eksitavat või ebaseaduslikku sisu või esineda kellegi teisena;",
              "saata rämpsposti või kasutada Skillseeki andmeid kõrvaliseks turunduseks;",
              "teisi kasutajaid ahistada, diskrimineerida või ähvardada;",
              "pakkuda deklareerimata tööd või midagi, mis rikub töö- või maksuseadusi;",
              "andmeid kraapida, hulgi kopeerida või segada teenuse või selle turvalisuse toimimist;",
              "kasutada Skillseeki meie tasudest kõrvalehoidmiseks, kui tasud kehtivad.",
            ],
          },
        ],
      },
      {
        heading: "9. Tasud",
        body: [
          "Beetaperioodil on Skillseek tasuta. Kui hakkame tasu võtma, teatame sellest vähemalt 30 päeva ette ja sinult ei võeta tasu millegi eest, millega sa pole nõustunud.",
        ],
      },
      {
        heading: "10. Konto peatamine ja lõpetamine",
        body: [
          "Võid Skillseeki kasutamise igal ajal lõpetada ja oma konto kustutada. Võime eemaldada sisu või peatada või sulgeda konto, kui see rikub neid tingimusi või seadust või seab ohtu teisi kasutajaid. Kui see on mõistlik, selgitame põhjust ja anname sulle võimaluse vastata.",
        ],
      },
      {
        heading: "11. Kättesaadavus ja muudatused",
        body: [
          "Skillseek on beetaversioonis. Teeme kõik, et teenus töötaks, kuid see ei pruugi alati kättesaadav olla ning võime funktsioone muuta, lisada või eemaldada.",
        ],
      },
      {
        heading: "12. Vastutus",
        body: [
          "Pakume Skillseeki „sellisena, nagu see on“. Me ei vastuta teiste kasutajate tegude ega tegevusetuse, kasutajatevaheliste kokkulepete ega kaudse kahju, näiteks saamata jäänud tulu või lepingute eest. Meie koguvastutus sinu ees on piiratud suurema summaga kahest: 100 eurot või tasud, mille oled meile nõudele eelnenud 12 kuu jooksul maksnud. Need piirangud ei kehti, kui seadus neid ei luba, sealhulgas tahtlikult või raske hooletuse tõttu tekitatud kahju korral.",
        ],
      },
      {
        heading: "13. Tingimuste muudatused",
        body: [
          "Võime neid tingimusi uuendada. Olulistest muudatustest teatame e-posti teel või rakenduses vähemalt 14 päeva enne nende jõustumist. Kui jätkad pärast seda Skillseeki kasutamist, kehtivad uued tingimused. Kui sa nendega ei nõustu, võid oma konto kustutada.",
        ],
      },
      {
        heading: "14. Kohaldatav õigus ja vaidlused",
        body: [
          "Nendele tingimustele kohaldatakse Eesti Vabariigi õigust. Püüame kõik vaidlused esmalt sinuga kokkuleppel lahendada. Lahendamata vaidlused lahendatakse Harju Maakohtus, kui kohustuslik õigus ei anna sulle õigust pöörduda mõnda teise kohtusse.",
        ],
      },
      {
        heading: "15. Kontakt",
        body: ["Küsimused nende tingimuste kohta: {email}. Isikuandmete töötlemist kirjeldab meie privaatsuspoliitika."],
      },
    ],
  },
};
