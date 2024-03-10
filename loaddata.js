loaddata = () =>
    fetch("noscript.html")
        .then(response => response.text())
        .then(html => {
            // Analyse syntaxique du code HTML
            const parser = new DOMParser();
            const parsedHtml = parser.parseFromString(html, "text/html");

            // Extraction des données
            const dataElement = parsedHtml.querySelector("#datatable");
            
            // Initialisation d'un tableau vide pour stocker les données
            var data = [];

            // On itère sur toutes les colonnes du tableau
            dataElement.querySelectorAll('tr').forEach(function(row) {
                var rowData = [];

                // On itère sur toutes les colonnes de la rangée
                row.querySelectorAll('td').forEach(function(cell) {
                    // On ajoute les données de la cellule dans le tableau
                    rowData.push(cell.textContent.trim().split(" ")[0]);
                });
                // Formattage des données pour les rendre plus utilisables
                rowData.splice(0, 1)
                rowData = rowData.map(str =>{
                    if (str.endsWith("♭")) {
                        return [str.slice(0, -1), -1]
                    } else if (str.endsWith("♯")) {
                        return [str.slice(0, -1), 1]
                    } else {
                        return [str, 0];
                    }
                })
                // Ajoute la rangée au tableau
                data.push(rowData);
            });
                // Encore du formattage nécessaire
                data.splice(0, 2)
                // Retourne les données
                console.log(data)
            })
        .catch(error => console.error('Erreur dans le chargement des données du jeu:', error));