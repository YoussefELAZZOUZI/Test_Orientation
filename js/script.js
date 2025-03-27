let questions = [];
let currentQuestion = 0;
const answers = []; // Stocke les réponses de l'utilisateur

// Met à jour la barre de progression et le texte
function updateProgress() {
    let progressText = `Question ${currentQuestion + 1} / ${questions.length}`;
    document.getElementById('progress').innerText = progressText;

    let progressPercentage = ((currentQuestion + 1) / questions.length) * 100;
    document.getElementById('progressBar').style.width = progressPercentage + "%";
}

// Charger les questions depuis PHP
async function fetchQuestions() {
    try {
        const response = await fetch('php/get_questions.php');
        questions = await response.json();
        showQuestion();
    } catch (error) {
        console.error("Erreur de chargement :", error);
    }
}

// Afficher une question avec la réponse sélectionnée
function showQuestion() {
    if (currentQuestion >= questions.length) return;

    const q = questions[currentQuestion];
    const savedAnswer = answers[currentQuestion]; // Récupérer la réponse déjà sélectionnée (si existante)

    document.getElementById('questionContainer').innerHTML = `
        <h2 id="questionTitle">${q.question_text}</h2>
        <div class="answer-container">
            ${q.answers.map(answer => `
                <div class="answer" 
                    onclick="selectAnswer(this, '${answer.type}')"
                    style="background-color: ${savedAnswer === answer.type ? '#ffcc00' : '#0a8fbf'};">
                    ${answer.reponse_text}
                </div>
            `).join('')}
        </div>
    `;

    updateProgress();
    document.getElementById('prevButton').style.display = currentQuestion > 0 ? 'inline-block' : 'none';
    document.getElementById('nextButton').disabled = !savedAnswer; // Activer "Suivant" si une réponse existe
}

// Sélectionner une réponse et la sauvegarder
function selectAnswer(element, value) {
    document.querySelectorAll('.answer').forEach(div => div.style.backgroundColor = "#0a8fbf");
    element.style.backgroundColor = "#ffcc00";

    answers[currentQuestion] = value; // Sauvegarde la réponse
    document.getElementById('nextButton').disabled = false;
}

// Passer à la question suivante
function nextQuestion() {
    if (!answers[currentQuestion]) return;

    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion();
    } else {
        submitAnswers();
    }
}

// Revenir à la question précédente (garde la réponse sélectionnée)
function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion();
    }
}

// Envoyer les réponses et afficher le résultat
function submitAnswers() {
    fetch('php/submit.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "error") {
            alert(data.message);
            return;
        }
        document.getElementById('result').innerHTML = `
            <h2>${data.nom}</h2>
            <p><strong>Description :</strong> ${data.description}</p>
            <p><strong>Secteurs :</strong> ${data.secturs}</p>
            <p><strong>Durée des études :</strong> ${data.duree}</p>
            <p><strong>Écoles disponibles :</strong> ${data.ecoles}</p>
            <p><strong>Avis :</strong> ${data.avis}</p>
            <button id="restartButton" onclick="restartTest()">Recommencer le Test</button>
        `;
        document.getElementById('result').style.display = "block";
        document.getElementById('questionContainer').style.display = "none";
        document.getElementById('nextButton').style.display = "none";
        document.getElementById('prevButton').style.display = "none";
    })
    .catch(error => console.error("Erreur d'envoi des réponses :", error));
}

// Fonction pour recommencer le test
function restartTest() {
    currentQuestion = 0;
    answers.length = 0; // Réinitialiser les réponses

    document.getElementById('result').style.display = "none";
    document.getElementById('questionContainer').style.display = "block";
    document.getElementById('nextButton').style.display = "inline-block";
    document.getElementById('prevButton').style.display = "none";
    document.getElementById('nextButton').disabled = true;

    showQuestion();
}

fetchQuestions();
