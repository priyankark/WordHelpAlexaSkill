"use strict";

var Alexa = require("alexa-sdk");

var Client = require('node-rest-client').Client;

var client = new Client();

// direct way
/*
client.get("https://api.datamuse.com/words?ml="+"ringing+in+the+ears", function (data,response) {
    // parsed response body as js object
    // raw response
    //console.log(response);
    console.log("The possible synonyms of are "+data[0]["word"]+", "+data[1]["word"]+", "+data[2]["word"]+", "+data[3]["word"]+", "+data[4]["word"]);
    //this.emit(':responseReady');
});
*/



var handlers = {
  'LaunchRequest': function() {
    var ref=this;
    var speechOutput="Word Help is your best companion for word games.\
    Find similar words, adjectives, nouns, rhyming words or look for particular patterns. Find sample invocations on the card in the app. Top 5 possible words are spoken and the rest of the words are sent to a card on the app. \
    ";
    var cardTitle="Sample Invocations";
    var cardContent="...to find words with a meaning similar to love \n"+
                    "...to find words related to love that start with the letter p \n"+
                    "...to find words related to love that end with the letter n \n "+
                    "...to find words that sound like elefint \n"+
                    "...to find words that start with t, end in k, and have two letters in between \n"+
                    "...to find words that are spelled similarly to love \n"+
                    "...to find words that rhyme with forgetful \n"+
                    "...to find words that rhyme with grape that are related to breakfast \n"+
                    "...to find adjectives that are often used to describe the sky \n"+
                    "...to find adjectives describing ocean sorted by how related they are to temperature \n"+
                    "...to find nouns that are often described by the adjective red \n"+
                    "...to find words that often follow \"drink\" in a sentence, that start with the letter w \n"+
                    "...to find words that are triggered by (strongly associated with) the word fish";
    ref.emit(':askWithCard', speechOutput,speechOutput,cardTitle, cardContent);
  },
  'AMAZON.StopIntent': function() {
      this.response.speak('Ok, see you again soon.');
      this.emit(':responseReady');
  },

  // Cancel
  'AMAZON.CancelIntent': function() {
      this.response.speak('Ok, see you again soon.');
      this.emit(':responseReady');
  },

  'AMAZON.HelpIntent': function() {
    var ref=this;
    var speechOutput="Word Help is your best companion for word games.\
    Find similar words, adjectives, nouns, rhyming words or look for particular patterns. Find sample invocations on the card in the app. Top 5 possible words are spoken and the rest of the words are sent to a card on the app. Pro Tip: Try to speak clearly with small breaks for the more complex queries. \
    ";
    var cardTitle="Sample Invocations";
    var cardContent="...to find words with a meaning similar to love \n"+
                    "...to find words related to love that start with the letter p \n"+
                    "...to find words related to love that end with the letter n \n "+
                    "...to find words that sound like elefint \n"+
                    "...to find words that start with t, end in k, and have two letters in between \n"+
                    "...to find words that are spelled similarly to love \n"+
                    "...to find words that rhyme with forgetful \n"+
                    "...to find words that rhyme with grape that are related to breakfast \n"+
                    "...to find adjectives that are often used to describe the sky \n"+
                    "...to find adjectives describing ocean sorted by how related they are to temperature \n"+
                    "...to find nouns that are often described by the adjective red \n"+
                    "...to find words that often follow \"drink\" in a sentence, that start with the letter w \n"+
                    "...to find words that are triggered by (strongly associated with) the word fish";
    ref.emit(':askWithCard', speechOutput, speechOutput,cardTitle, cardContent);
  },



  'synonyms': function () {
    var userAnswer = this.event.request.intent.slots.word.value;
    var toTell="";
    var ref=this;
    client.get("https://api.datamuse.com/words?ml="+userAnswer, function (data,response) {
        // parsed response body as js object
        // raw response
        //console.log(response);
        if(data.length==0)
        ref.emit(':tell','Please try again.');
        var cardTitle="Synonyms";
        var speechOutput="The words similar to "+userAnswer+" are ";
        for(var i=0;i<(data.length>=5?5:data.length);i++)
        speechOutput+=data[i]["word"]+", ";
        var cardContent="";
        for(var i=0;i<(data.length);i++)
        cardContent+=data[i]["word"]+", ";
        ref.emit(':tellWithCard', speechOutput, cardTitle, cardContent);

    });
  },

  "startWith":function(){
    var word=this.event.request.intent.slots.word.value;
    var letter=this.event.request.intent.slots.letter.value;
    var toTell="";
    var ref=this;
    var url="https://api.datamuse.com/words?ml="+word+"&sp="+letter+"*";
    client.get(url, function (data,response) {
      if(data.length==0)
      ref.emit(':tell','Please try again.');
      var cardTitle="Synonyms that start with "+letter;
      var speechOutput="The synonyms of "+word+" are ";
      for(var i=0;i<(data.length>=5?5:data.length);i++)
      speechOutput+=data[i]["word"]+", ";
      var cardContent="";
      for(var i=0;i<(data.length);i++)
      cardContent+=data[i]["word"]+", ";
      ref.emit(':tellWithCard', speechOutput, cardTitle, cardContent);
    });


  },

  "endWith":function(){
    var word=this.event.request.intent.slots.word.value;
    var letter=this.event.request.intent.slots.letter.value;
    var toTell="";
    var ref=this;
    var url="https://api.datamuse.com/words?ml="+word+"&sp=*"+letter;
    client.get(url, function (data,response) {
      if(data.length==0)
      ref.emit(':tell','Please try again.');
      var cardTitle="Synonyms that end with "+letter;
      var speechOutput="The synonyms of "+word+" are ";
      for(var i=0;i<(data.length>=5?5:data.length);i++)
      speechOutput+=data[i]["word"]+", ";
      var cardContent="";
      for(var i=0;i<(data.length);i++)
      cardContent+=data[i]["word"]+", ";
      ref.emit(':tellWithCard', speechOutput, cardTitle, cardContent);
    });

  },

  "soundLike":function(){
    var word=this.event.request.intent.slots.word.value;
    //var letter=this.event.request.intent.slots.letter.value;
    var toTell="";
    var ref=this;
    var url="https://api.datamuse.com/words?sl="+word;
    client.get(url, function (data,response) {
      if(data.length==0)
      ref.emit(':tell','Please try again.');
      var cardTitle="Words that sound like "+word;
      var speechOutput="The words with similar sound as "+word+" are ";
      for(var i=0;i<(data.length>=5?5:data.length);i++)
      speechOutput+=data[i]["word"]+", ";
      var cardContent="";
      for(var i=0;i<(data.length);i++)
      cardContent+=data[i]["word"]+", ";
      ref.emit(':tellWithCard', speechOutput, cardTitle, cardContent);
    });

  },

  "similarPattern":function(){
    var letter1=this.event.request.intent.slots.letterone.value;
    var letter2=this.event.request.intent.slots.lettertwo.value;
    var num=this.event.request.intent.slots.num.value;
    var toTell="";
    var ref=this;
    var url="https://api.datamuse.com/words?sp="+letter1;
    for(var i=0;i<num;i++)
    url+="?";
    url+=letter2;
    client.get(url, function (data,response) {
      if(data.length==0)
      ref.emit(':tell','Please try again.');
      var cardTitle="Synonyms with similar pattern involving letters "+letter1+" and "+letter2;
      var speechOutput="The words with similar pattern are ";
      for(var i=0;i<(data.length>=5?5:data.length);i++)
      speechOutput+=data[i]["word"]+", ";
      var cardContent="";
      for(var i=0;i<(data.length);i++)
      cardContent+=data[i]["word"]+", ";
      ref.emit(':tellWithCard', speechOutput, cardTitle, cardContent);
    });
  },

  "spelledSimilar":function(){
    var word=this.event.request.intent.slots.word.value;
    //var letter=this.event.request.intent.slots.letter.value;
    var toTell="";
    var ref=this;
    var url="https://api.datamuse.com/words?sp="+word;
    client.get(url, function (data,response) {
      if(data.length==0)
      ref.emit(':tell','Please try again.');
      var cardTitle="Words that are spelled similar to "+word;
      var speechOutput="The similarly spelled words of "+word+" are ";
      for(var i=0;i<(data.length>=5?5:data.length);i++)
      speechOutput+=data[i]["word"]+", ";
      var cardContent="";
      for(var i=0;i<(data.length);i++)
      cardContent+=data[i]["word"]+", ";
      ref.emit(':tellWithCard', speechOutput, cardTitle, cardContent);
    });

  },

  "rhyme":function(){
    var word=this.event.request.intent.slots.word.value;
    //var letter=this.event.request.intent.slots.letter.value;
    var toTell="";
    var ref=this;
    var url="https://api.datamuse.com/words?rel_rhy="+word;
    client.get(url, function (data,response) {
      if(data.length==0)
      ref.emit(':tell','Please try again.');
      var cardTitle="Words that rhyme with "+word;
      var speechOutput="The rhyming words of "+word+" are ";
      for(var i=0;i<(data.length>=5?5:data.length);i++)
      speechOutput+=data[i]["word"]+", ";
      var cardContent="";
      for(var i=0;i<(data.length);i++)
      cardContent+=data[i]["word"]+", ";
      ref.emit(':tellWithCard', speechOutput, cardTitle, cardContent);
    });

  },

  "rhymeRelate":function(){
    var word1=this.event.request.intent.slots.wordone.value;
    var word2=this.event.request.intent.slots.wordtwo.value;
    //var letter=this.event.request.intent.slots.letter.value;
    var toTell="";
    var ref=this;
    var url="https://api.datamuse.com/words?ml="+word1+"&"+"rel_rhy="+word2;
    client.get(url, function (data,response) {
      if(data.length==0)
      ref.emit(':tell','Please try again.');
      var cardTitle="Synonyms of "+word1+" that rhyme with "+word2;
      var speechOutput="The synonyms of "+word1+" that rhyme with "+word2+" are ";
      for(var i=0;i<(data.length>=5?5:data.length);i++)
      speechOutput+=data[i]["word"]+", ";
      var cardContent="";
      for(var i=0;i<(data.length);i++)
      cardContent+=data[i]["word"]+", ";
      ref.emit(':tellWithCard', speechOutput, cardTitle, cardContent);
    });

  },

  "adjective":function(){
    var word=this.event.request.intent.slots.word.value;
    //var letter=this.event.request.intent.slots.letter.value;
    var toTell="";
    var ref=this;
    var url="https://api.datamuse.com/words?rel_jjb="+word;
    client.get(url, function (data,response) {
      if(data.length==0)
      ref.emit(':tell','Please try again.');
      var cardTitle="Adjectives used to describe  "+word;
      var speechOutput="Adjectives used to describe "+word+" are ";
      for(var i=0;i<(data.length>=5?5:data.length);i++)
      speechOutput+=data[i]["word"]+", ";
      var cardContent="";
      for(var i=0;i<(data.length);i++)
      cardContent+=data[i]["word"]+", ";
      ref.emit(':tellWithCard', speechOutput, cardTitle, cardContent);
    });


  },

  "adjectiveMeaning":function(){
    var word1=this.event.request.intent.slots.wordone.value;
    var word2=this.event.request.intent.slots.wordtwo.value;
    //var letter=this.event.request.intent.slots.letter.value;
    var toTell="";
    var ref=this;
    var url="https://api.datamuse.com/words?rel_jjb="+word1+"&topics="+word2;
    client.get(url, function (data,response) {
      if(data.length==0)
      ref.emit(':tell','Please try again.');
      var cardTitle="Adjectives with associated meaning ";
      var speechOutput="The required words could be ";
      for(var i=0;i<(data.length>=5?5:data.length);i++)
      speechOutput+=data[i]["word"]+", ";
      var cardContent="";
      for(var i=0;i<(data.length);i++)
      cardContent+=data[i]["word"]+", ";
      ref.emit(':tellWithCard', speechOutput, cardTitle, cardContent);
    });
  },

    "nouns":function(){

      var word=this.event.request.intent.slots.word.value;
      //var letter=this.event.request.intent.slots.letter.value;
      var toTell="";
      var ref=this;
      var url="https://api.datamuse.com/words?rel_jja="+word;
      client.get(url, function (data,response) {
        if(data.length==0)
        ref.emit(':tell','Please try again.');
        var cardTitle="Nouns described by "+word;
        var speechOutput="The nouns described by "+word+" are ";
        for(var i=0;i<(data.length>=5?5:data.length);i++)
        speechOutput+=data[i]["word"]+", ";
        var cardContent="";
        for(var i=0;i<(data.length);i++)
        cardContent+=data[i]["word"]+", ";
        ref.emit(':tellWithCard', speechOutput, cardTitle, cardContent);
      });
    },

    "sentence":function(){
      var word=this.event.request.intent.slots.word.value;
      var letter=this.event.request.intent.slots.letter.value;
      //var letter=this.event.request.intent.slots.letter.value;
      var toTell="";
      var ref=this;
      var url="https://api.datamuse.com/words?lc="+word+"&sp="+letter+"*";
      client.get(url, function (data,response) {
        if(data.length==0)
        ref.emit(':tell','Please try again.');
        var cardTitle="words followed by "+word+" starting with "+letter;
        var speechOutput="Words followed by "+word+" in a sentence are ";
        for(var i=0;i<(data.length>=5?5:data.length);i++)
        speechOutput+=data[i]["word"]+", ";
        var cardContent="";
        for(var i=0;i<(data.length);i++)
        cardContent+=data[i]["word"]+", ";
        ref.emit(':tellWithCard', speechOutput, cardTitle, cardContent);
      });
    },

    "trigger":function(){
      var word=this.event.request.intent.slots.word.value;
      //var letter=this.event.request.intent.slots.letter.value;
      var toTell="";
      var ref=this;
      var url="https://api.datamuse.com/words?rel_trg="+word;
      client.get(url, function (data,response) {
        if(data.length==0)
        ref.emit(':tell','Please try again.');
        var cardTitle="Words triggered by "+word;
        var speechOutput="The words triggered by "+word+" are ";
        for(var i=0;i<(data.length>=5?5:data.length);i++)
        speechOutput+=data[i]["word"]+", ";
        var cardContent="";
        for(var i=0;i<(data.length);i++)
        cardContent+=data[i]["word"]+", ";
        ref.emit(':tellWithCard', speechOutput, cardTitle, cardContent);
      });

    }
};


exports.handler = function(event, context, callback){
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};
