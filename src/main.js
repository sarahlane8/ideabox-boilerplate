var userInputTitle = document.querySelector('#userCardTitle');
var userInputBody = document.querySelector('#userCardBody');

var starredIdeaBtn = document.querySelector('.starred-ideas-btn');
var saveIdeaBtn = document.querySelector('.save-idea-btn');
var savedIdeaCards = [];

saveIdeaBtn.addEventListener('click', createNewIdea);
// starredIdeaBtn.addEventListener('click', )

function createNewIdea() {
  event.preventDefault();
  var newIdeaCard = new Idea(userInputTitle.value, userInputBody.value);
  return newIdeaCard;
}