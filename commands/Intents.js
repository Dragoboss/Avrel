module.exports = {
    name: "i",
    async execute(client, message, functions, args, set) {
        message.delete().catch(_ => { });
        const adminRoles = set[client.user.username].adminRoles;
        if (message.channel.type == "DM" ||
            message.member.roles.cache.some(r => adminRoles.includes(r.id)) ||
            message.member.permissions.has("ADMINISTRATOR")
        ) {
            const data = await functions.SpreadsheetGET(client);
            const sheet = data.doc.sheetsByTitle["NewIntents"];
            const rows = await sheet.getRows({ offset: 0 });
            const cells = await sheet.loadCells({ startRowIndex: 0, endRowIndex: 10, startColumnIndex: 0, endColumnIndex: 10 });

          
            var parameters = "No";
            var parts = [];
            var displayName = "";
            var paramName = "";
            if (rows.length) {
                for (var row of rows) {
                    if (row.IntentName !== "") {
                        if (row.Parameters !== "No") {
                            parameters = "Yes";
                            
                            var cell = await sheet.getCell(row.rowNumber - 1, 3)
                            if (cell.value === "true") {
                                
                            }
                        }
                    }
                }
            }

            // parts, displayName, parameters, paramName
            //if(embed[0].mention){
            //    message.channel.send(embed[0].mention)
            //}
            //message.channel.send({ embeds: [finalEmbed] });;
        }
    }
};
