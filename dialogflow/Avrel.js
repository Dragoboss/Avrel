module.exports = {
    execute: async function(client, message, functions, set, MessageEmbed) {
        if(message.channel.type == "DM" ||
            message.mentions.has(client.user.id) || 
            message.content.toLowerCase().substring(0,5) === "avrel") {

            message.content = message.content.replace("@undefined", "");
            message.content = message.content.replace("avrel", "");
            const answer = await functions.DialogflowQuery(client, message);
            const data = await functions.SpreadsheetGET(client);
            var rows;
            var sheet;
            var embed;
            var mEmbeds = new Array();
            var finalEmbed;

            if(answer.intent.substring(0, 5) === "embed") {
                rows = await data.doc.sheetsByTitle["Embeds"].getRows();
                embed = rows.filter((row) =>
                    row.name == answer.intent);
                finalEmbed = functions.EmbedBuilder(embed);
                message.channel.send({
                    embeds: [finalEmbed]
                });
                if (answer.response !== undefined && answer.response !== "") {
                    message.channel.send(answer.response);
                }
            } else if(answer.intent.substring(0,2) === "$$") {
                const intName = answer.intent.slice(2);
                if(answer.result[0].queryResult.allRequiredParamsPresent === false) {
                    message.channel.send(answer.response);
                } else if(answer.result[0].queryResult.allRequiredParamsPresent === true) {
                    sheet = data.doc.sheetsByTitle["Embeds"];
                    rows = await sheet.getRows();
                    const param = answer.result[0].queryResult.parameters.fields;

                    var prevEntry = "";
                    var currEntry = "";
                    for(var entry of Object.values(param)) {
                        if(currEntry !== entry.stringValue) {
                            prevEntry = currEntry;
                        }
                        currEntry = entry.stringValue;
                    }
                    if (currEntry !== "" && prevEntry !== "") {
                        embed = rows.filter((row) => row.name == intName + "." + currEntry + "." + prevEntry)
                        if (embed.length !== 0) {
                            finalEmbed = functions.EmbedBuilder(embed);
                            mEmbeds.push(finalEmbed);
                        } else {
                            embed = rows.filter((row) => row.name == intName + "." + prevEntry + "." + currEntry);
                            finalEmbed = functions.EmbedBuilder(embed);
                            mEmbeds.push(finalEmbed);
                        }
                    } else {
                        if (prevEntry === "") {
                          prevEntry = currEntry;
                        }
                        embed = rows.filter(
                            (row) =>
                            row.name ==
                            intName + "." + prevEntry
                        );
                        finalEmbed = functions.EmbedBuilder(embed);
                        mEmbeds.push(finalEmbed); 
                    }
                }
                message.channel.send({
                   embeds: mEmbeds
                });
                if (answer.response !== undefined && answer.response !== "") {
                    if (prevEntry === currEntry) {
                        message.channel.send(answer.response);
                    }
                }
            } else if(answer.intent.substring(0, 1) === "$") {
                const intName = answer.intent.slice(1);
                if(answer.result[0].queryResult.allRequiredParamsPresent === false) {
                    message.channel.send(answer.response);
                } else if(answer.result[0].queryResult.allRequiredParamsPresent === true) {
                    sheet = data.doc.sheetsByTitle["Embeds"];
                    rows = await sheet.getRows();
                    const param = answer.result[0].queryResult.parameters.fields;

                    var prevEntry;
                    for(var entry of Object.values(param)) {
                        embed = rows.filter(
                            (row) =>
                            row.name ==
                            intName + "." + entry.stringValue
                        );
                        if(prevEntry !== entry.stringValue) {
                            finalEmbed = functions.EmbedBuilder(embed);
                            mEmbeds.push(finalEmbed);
                            prevEntry = entry.stringValue;
                        }
                    }
                }
                message.channel.send({
                    embeds: mEmbeds
                });
                if (answer.response !== undefined && answer.response !== "") {
                    message.channel.send(answer.response);
                }
            } else if(answer.intent === "Tip") {
                sheet = data.doc.sheetsByTitle["Tips"];
                rows = await sheet.getRows();
                const tip = rows[Math.floor(Math.random() * rows.length)].tip;
                message.channel.send("💡 " + tip);
            } else if(answer.intent === "Meme") {
                try {
                    sheet = data.doc.sheetsByTitle["Memes"];
                    rows = await sheet.getRows();
                    const meme = rows[Math.floor(Math.random() * rows.length)].meme;
                    message.channel.send(meme);
                } catch (e) {
                    console.log(e);
                }
            } else if(answer.intent === "Fun Fact") {

                sheet = data.doc.sheetsByTitle["Fun Facts"];
                rows = await sheet.getRows();
                const fact = rows[Math.floor(Math.random() * rows.length)].fact;
                message.channel.send("🤣 " + fact);
            } else {
                message.channel.send(answer.response);
            }
        }
    },
    name: "Avrel"
};