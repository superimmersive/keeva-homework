// Homework data. Add new subjects to SUBJECTS; add weeks to WEEKS.
window.HW = {
  term: "Term 4 2026", school: "Country House School", child: "Keeva",
  week1Start: "2026-10-05", // Monday of Week 1 (Week 1 starts Tue 6 Oct)
  spelling: {
    2:"mow own slow row yellow blow rainbow window foal hope toad stone",
    3:"few new dew chew screw grew pew slew use cube value statue",
    4:"autumn fault haunt taunt automatic haul fraud astronaut sauce author August pause",
    5:"foxes dishes churches puppies quizzes girls apples toys watches babies stories brushes",
    6:"bike like time kite five ride hide side smile white drive prize",
    7:"saw paw jaw sawmill withdraw prawn straw crawl jigsaw Paul fault yawn",
    8:"cake make take name game same place face snake grape flame plane"
  },
  sentences: { // optional example sentences; generic one used otherwise
    mow:"Dad will mow the grass.", own:"I have my own bed.", slow:"The snail is slow.", row:"We sit in a row.",
    yellow:"The sun is yellow.", blow:"Blow out the candles.", rainbow:"I see a rainbow in the sky.",
    window:"Look out of the window.", foal:"The foal is a baby horse.", hope:"I hope it is sunny.",
    toad:"The toad hops in the pond.", stone:"I found a smooth stone."
  },
  tricky:"half quarter eleven twelve thirteen seventeen twenty forty seventy because pause author trauma mice children women woman mouse eighty hundred thousand million zero so where were more which why who any many other because want before put their saw right made two four should would could goes does when what down like live have give little by old only one father mother also love cover upon always every of eight after once sister brother grandma grandpa aunt uncle nephew niece cousin sibling parent friend son daughter May February June October August friend April September November March July January December",
  dictation: {
    2:"The foal steps on a big stone.", 3:"The fat toads looked out of the window.",
    4:"She threw twenty cubes into the pool.", 5:"We picked forty apples for the tarts.",
    6:"Why did the mice eat all the toadstools?",
    7:"One thousand men dropped their jaws when they saw the huge prawn crawl.",
    8:"Have you seen half of a yellow sun? The brave snake came out of its cage."
  },
  afrikaans: {
    spelling: {
      2:"vang bang ring gang hang sing bring spring slang koning tong string",
      3:"bank ink lank sink drink flink mink slank stink plank wink klink",
      4:"wolf bang golf half kalf salf halfpad selfoon halfmaan elfde twaalfde self",
      5:"kalk valk wolk melk lank rots bots bons kuns wens dans kans",
      6:"sent tent plant lint land rots sand brand hond grond kant band",
      7:"lamp tent kamp stamp lomp klomp hemp vorms wurms ooms berg sorg",
      8:"vurk mark hark kerk skerm derm warm serp dorp slurp karp krap"
    },
    sigwoorde:"maar nog daar aan haar gaan laat maak soos ook wees weet jou nou sou hou uit huis saam baie nee hier dag dra teen eet weg neem hul gemaak gesien sak wag daarom almal aan land lekker sommer is vertel hoekom sny alleen stuur rooi draai besluit dankie kry klaar gegaan geneem werk",
    dictation: {
      2:"Ek vang die groot rooi bal wat oor die heining vlieg.",
      3:"Ek drink elke oggend 'n glas koue melk voordat ek skool toe gaan.",
      4:"Die groot grys wolf loop stadig deur die donker bos.",
      5:"My ma gee vir my 'n glas vars melk om te drink.",
      6:"Ons plant mooi blomme in die tuin langs die huis.",
      7:"Ons gaan die vakansie in 'n tent slaap.",
      8:"Die weer is vandag baie warm, daarom drink ek baie water."
    }
  },
  // Maths Term 4 – Week 1 starts Tue 6 Oct 2026
  maths: {
    money: {
      notes: [
        {id:"R10", label:"R10", cents:1000, kind:"note", color:"#2e7d32"},
        {id:"R20", label:"R20", cents:2000, kind:"note", color:"#6d4c41"},
        {id:"R50", label:"R50", cents:5000, kind:"note", color:"#c62828"},
        {id:"R100", label:"R100", cents:10000, kind:"note", color:"#1565c0"},
        {id:"R200", label:"R200", cents:20000, kind:"note", color:"#ef6c00"}
      ],
      coins: [
        {id:"10c", label:"10c", cents:10, kind:"coin", color:"#b0bec5"},
        {id:"20c", label:"20c", cents:20, kind:"coin", color:"#90a4ae"},
        {id:"50c", label:"50c", cents:50, kind:"coin", color:"#78909c"},
        {id:"R1", label:"R1", cents:100, kind:"coin", color:"#c0c0c0"},
        {id:"R2", label:"R2", cents:200, kind:"coin", color:"#d4af37"},
        {id:"R5", label:"R5", cents:500, kind:"coin", color:"#b87333"}
      ]
    },
    weeks: {
      1: {
        title: "Revision",
        dates: "6–9 Oct",
        activities: [
          {id:"count", title:"Count in 1s, 2s, 5s & 10s", blurb:"Fill in the missing numbers from 0 to 200.", type:"sequence", steps:[1,2,5,10], min:0, max:200, n:8},
          {id:"tables", title:"Tables ×2, ×3, ×4, ×5", blurb:"Practise your times tables.", type:"tables", tables:[2,3,4,5], n:10}
        ]
      },
      2: {
        title: "Tables, counting & number names",
        dates: "12–16 Oct",
        activities: [
          {id:"tables", title:"Tables ×2 and ×3", blurb:"Quick times-table practice.", type:"tables", tables:[2,3], n:10},
          {id:"count", title:"Count in 3s and 4s", blurb:"Forwards and backwards from 100 to 200.", type:"sequence", steps:[3,4], min:100, max:200, n:8},
          {id:"names", title:"Number names", blurb:"Write the words for numbers 100–200.", type:"names", examples:[113,134,179], n:6},
          {id:"quiz", title:"Friday revision quiz", blurb:"A mix of this week’s maths.", type:"quiz", mix:["tables","sequence","names"], tables:[2,3], steps:[3,4], min:100, max:200, n:10}
        ]
      },
      3: {
        title: "Place value & rounding",
        dates: "19–23 Oct",
        activities: [
          {id:"tables", title:"Tables ×4 and ×5", blurb:"Quick times-table practice.", type:"tables", tables:[4,5], n:10},
          {id:"breakup", title:"Break up numbers", blurb:"e.g. 136 = 100 + 30 + 6", type:"breakup", examples:[145,183,267], n:8},
          {id:"round", title:"Round to the nearest 10", blurb:"e.g. 24, 37, 58", type:"round", n:8},
          {id:"quiz", title:"Friday revision quiz", blurb:"A mix of this week’s maths.", type:"quiz", mix:["tables","breakup","round"], tables:[4,5], n:10}
        ]
      },
      4: {
        title: "Add & subtract in steps",
        dates: "26–30 Oct",
        activities: [
          {id:"tables", title:"Tables ×2 to ×5", blurb:"Quick times-table practice.", type:"tables", tables:[2,3,4,5], n:10},
          {id:"addsteps", title:"Add in steps", blurb:"e.g. 52 + 37 = 52 + 30 + 7", type:"addsteps", n:8},
          {id:"substeps", title:"Subtract in steps", blurb:"e.g. 87 − 56 and 65 − 37", type:"substeps", n:8},
          {id:"quiz", title:"Friday revision quiz", blurb:"A mix of this week’s maths.", type:"quiz", mix:["tables","addsteps","substeps"], tables:[2,3,4,5], n:10}
        ]
      },
      5: {
        title: "Money",
        dates: "2–6 Nov",
        activities: [
          {id:"tables", title:"Tables ×2 to ×5", blurb:"Quick times-table practice.", type:"tables", tables:[2,3,4,5], n:10},
          {id:"moneyid", title:"Notes and coins", blurb:"Recognise South African money.", type:"moneyid", n:8},
          {id:"moneyadd", title:"Add money", blurb:"e.g. 20c + 50c + 10c", type:"moneyadd", n:8},
          {id:"change", title:"Give change", blurb:"e.g. R2 − 40c, R30 − R9.50", type:"change", n:8},
          {id:"quiz", title:"Friday revision quiz", blurb:"A mix of this week’s maths.", type:"quiz", mix:["tables","moneyid","moneyadd","change"], tables:[2,3,4,5], n:10}
        ]
      },
      6: {
        title: "Fractions & sharing",
        dates: "9–13 Nov",
        activities: [
          {id:"tables", title:"Tables ×2 to ×5", blurb:"Quick times-table practice.", type:"tables", tables:[2,3,4,5], n:10},
          {id:"fracshade", title:"Halves, thirds, quarters & fifths", blurb:"What fraction is shaded?", type:"fracshade", n:8},
          {id:"fracset", title:"Fraction of a set", blurb:"e.g. one third of 12 oranges", type:"fracset", n:8},
          {id:"sharing", title:"Sharing with remainders", blurb:"e.g. 25 apples into 3 baskets", type:"sharing", n:8},
          {id:"quiz", title:"Friday revision quiz", blurb:"A mix of this week’s maths.", type:"quiz", mix:["tables","fracshade","fracset","sharing"], tables:[2,3,4,5], n:10}
        ]
      }
    }
  },
  plan: {
    1:[
      {subj:"Maths",text:"Count forwards & backwards in 1s, 2s, 5s and 10s (0–200)"},
      {subj:"Maths",text:"Tables ×2, ×3, ×4, ×5"}
    ],
    2:[
      {subj:"English",text:"Practise & write spelling words, tricky words and dictation"},
      {subj:"English",text:"Friday: spelling test"},
      {subj:"Maths",text:"2 and 3 times tables (p.16)"},
      {subj:"Maths",text:"Count forwards & backwards in 3s and 4s from 100 to 200 (p.4, 17-18)"},
      {subj:"Maths",text:"Number names for 113, 134 and 179 (p.6)"},
      {subj:"Maths",text:"Friday: revision quiz"},
      {subj:"Afrikaans",text:"Spelwoorde, sigwoorde en diktee"},
      {subj:"Afrikaans",text:"Friday: spelling test"},
      {subj:"Life Skills",text:"Thursday: Show and Tell – our 9 provinces and which one I live in (Western Cape)"}
    ],
    3:[
      {subj:"Maths",text:"Tables ×4 and ×5"},
      {subj:"Maths",text:"Break up numbers (e.g. 136 = 100 + 30 + 6)"},
      {subj:"Maths",text:"Round to the nearest 10"},
      {subj:"Maths",text:"Friday: revision quiz"},
      {subj:"Life Skills",text:"Donderdag: Wys en Vertel – nasionale simbole (protea, springbok, bloukraanvoël, geelhout, galjoen)"}
    ],
    4:[
      {subj:"Maths",text:"Tables ×2, ×3, ×4, ×5"},
      {subj:"Maths",text:"Add in steps (e.g. 52 + 37 = 52 + 30 + 7)"},
      {subj:"Maths",text:"Subtract in steps (e.g. 87 − 56)"},
      {subj:"Maths",text:"Friday: revision quiz"},
      {subj:"Life Skills",text:"Thursday: Show and Tell – one way we send a message (letter, SMS, email or the news)"}
    ],
    5:[
      {subj:"Maths",text:"Tables ×2 to ×5"},
      {subj:"Maths",text:"Recognise SA notes and coins"},
      {subj:"Maths",text:"Add money and give change"},
      {subj:"Maths",text:"Friday: revision quiz"},
      {subj:"Life Skills",text:"Donderdag: Wys en Vertel – hoe praat dowe mense en hoe lees blinde mense? (gebaretaal & braille)"}
    ],
    6:[
      {subj:"Maths",text:"Tables ×2 to ×5"},
      {subj:"Maths",text:"Halves, thirds, quarters and fifths"},
      {subj:"Maths",text:"Fraction of a set & sharing with remainders"},
      {subj:"Maths",text:"Friday: revision quiz"},
      {subj:"Life Skills",text:"Thursday: Show and Tell – a nocturnal animal and the senses that help at night"}
    ]
  },
  subjects: [
    {id:"english",name:"English",emoji:"📖",color:"#ff6b9d"},
    {id:"maths",name:"Maths",emoji:"🔢",color:"#2196f3"},
    {id:"afrikaans",name:"Afrikaans",emoji:"🇿🇦",color:"#9c27b0"},
    {id:"lifeskills",name:"Life Skills",emoji:"🌍",color:"#ff7043"}
  ]
};
