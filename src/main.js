//**********************Query Selectors**********************//

var cardBodyInput = document.getElementById('userCardBody');
var cardTitleInput = document.getElementById('userCardTitle');
var commentForm = document.querySelector('.user-comment-form');
var commentInputBox = document.querySelector('.user-comment-box');
var ideaForm = document.querySelector('.user-idea-form')
var saveCommentBtn = document.querySelector('.add-comment-btn');
var savedCardsGrid = document.querySelector('.saved-cards-grid')
var saveIdeaBtn = document.getElementById('saveButton');
var searchBarInput = document.getElementById('searchBar');
var showStarredIdeaBtn = document.getElementById('starredIdeas');
var takeBackToMainBtn = document.querySelector('.take-back-to-main');


//**********************Event Listeners**********************//

window.addEventListener('load', renderLocalStorageCards)
ideaForm.addEventListener('keyup', saveBtnStatus);
saveCommentBtn.addEventListener('click', createNewComment);
savedCardsGrid.addEventListener('click', targetCardClick);
saveIdeaBtn.addEventListener('click', createNewIdea);
showStarredIdeaBtn.addEventListener('click', showStarredIdeas);
searchBarInput.addEventListener('keyup', searchIdeas);
takeBackToMainBtn.addEventListener('click', takeBackToMain);


//**********************Global Variables**********************//

var savedIdeaCards = [];
var filteredIdeaCards = [];
var redStarSrc = "https://drive.google.com/uc?export=view&id=13_jn9vQvAdNzdcbdRmYoR6mBOZHoeqzU";
var whiteStarSrc = "https://drive.google.com/uc?export=view&id=1TW-aKpR_uBW0Ayp6AtTqVq5cxuX27GiH";
var startStar = false;
var commentCardId;
saveIdeaBtn.disabled = true;


//**********************Functions**********************//

function saveBtnStatus() {
  saveIdeaBtn.disabled = (cardBodyInput.value === '' || cardTitleInput.value === '');
}


function createNewIdea() {
  event.preventDefault();
  saveBtnStatus();
  var newIdeaCard = new Idea(Date.now(), cardTitleInput.value, cardBodyInput.value, startStar);
  newIdeaCard.saveToStorage(newIdeaCard);
  renderIdeaCards(savedIdeaCards);
  clearInputFields();
  if (showStarredIdeaBtn.innerText = "Show All Ideas") {
    toggleStarredIdeasBtn()
  }
}


function renderIdeaCards(array) {
  var ideaCardHtml = '';
  for (var i = 0; i < array.length; i++) {
    ideaCardHtml += `
      <section class="saved-cards" id="${array[i].id}">
        <div class='favorite-delete'>
          <img class='favorited-star' src="${array[i].star ? redStarSrc: whiteStarSrc}" alt="favorite star">
          <img class='delete-card-x' src="https://drive.google.com/uc?export=view&id=1DFdu572EVYb1SXhsXQ0XDqvfZ7prhJWg" alt="delete card x">
        </div>
        <article class='idea-title-body'>
          <p class='idea-card-title'>${array[i].title}</p>
          <p class='idea-card-body'>${array[i].body}</p>
        </article>
        <div class='comment-bar'>
          <img class='add-comment' src="https://drive.google.com/uc?export=view&id=1xk4FryiJY3UgKdzYQhKdKPBe75ubWaYt" alt="add comment">
          <span>${array[i].comments[0] ? array[i].comments[0]: 'Comment'}</span>
        </div>
      </section>
    `
    savedCardsGrid.innerHTML = ideaCardHtml;
  }
}


function clearInputFields() {
  cardTitleInput.value = '';
  cardBodyInput.value = '';
  saveIdeaBtn.disabled = true;
  commentInputBox.value = '';
  saveCommentBtn.disabled = true;
}


function targetCardClick(event) {
  var cardEl = event.target.closest('.saved-cards');
  var cardId = cardEl && parseInt(cardEl.id);
  if (event.target.className === 'delete-card-x') {
    deleteCard(cardId)
  }
  if (event.target.className === 'favorited-star') {
    toggleIsFavorite(cardId);
  }
  if (event.target.className === 'add-comment') {
    addComment(cardId);
  }
}


function deleteCard(cardId) {
  for (var i = 0; i < savedIdeaCards.length; i++) {
    if (savedIdeaCards[i].id === cardId) {
      savedIdeaCards[i].deleteFromStorage(cardId);
      savedIdeaCards.splice(i, 1);
    }
    event.target.closest('.saved-cards').remove();
  }
}


function toggleIsFavorite(cardId) {
  for (var i = 0; i < savedIdeaCards.length; i++) {
    if (savedIdeaCards[i].id === cardId) {
      savedIdeaCards[i].updateIdea(savedIdeaCards[i]);
    }
  }
  renderIdeaCards(savedIdeaCards);
}


function addComment(cardId) {
  ideaForm.classList.add('hidden');
  commentForm.classList.remove('hidden');
  commentCardId = cardId;
}


function createNewComment() {
  event.preventDefault();
  var newComment = new Comment(commentInputBox.value);
  for (var i = 0; i < savedIdeaCards.length; i++) {
    if (commentCardId === savedIdeaCards[i].id) {
      savedIdeaCards[i].comments.push(newComment.data);
    }
  }
  renderIdeaCards(savedIdeaCards);
  clearInputFields();
}


function displayIdeaForm() {
  ideaForm.classList.remove('hidden');
  commentForm.classList.add('hidden');
}


function renderLocalStorageCards() {
  var ideaCardHtml = '';
  for (var i = 0; i < localStorage.length; i++) {
    var id = localStorage.key(i);
    var item = JSON.parse(localStorage.getItem(id));
    var newIdeaCard = new Idea(item.id, item.title, item.body, item.star)
    savedIdeaCards.push(newIdeaCard);
  }
  renderIdeaCards(savedIdeaCards);
}


function showStarredIdeas() {
  if (showStarredIdeaBtn.innerText === "Show Starred Ideas") {
    var ideaCardHtml = '';
    for (var i = 0; i < savedIdeaCards.length; i++)  {
      if (savedIdeaCards[i].star) {
        ideaCardHtml += `
          <section class="saved-cards" id="${savedIdeaCards[i].id}">
            <div class='favorite-delete'>
              <img class='favorited-star' src="${savedIdeaCards[i].star ? redStarSrc: whiteStarSrc}" alt="favorite star">
              <img class='delete-card-x' src="https://drive.google.com/uc?export=view&id=1DFdu572EVYb1SXhsXQ0XDqvfZ7prhJWg" alt="delete card x">
            </div>
            <article class='idea-title-body'>
              <p class='idea-card-title'>${savedIdeaCards[i].title}</p>
              <p class='idea-card-body'>${savedIdeaCards[i].body}</p>
            </article>
            <div class='comment-bar'>
              <img class='add-comment' src="https://drive.google.com/uc?export=view&id=1xk4FryiJY3UgKdzYQhKdKPBe75ubWaYt" alt="add comment">
              <span>Comment</span>
            </div>
          </section>
        `
        savedCardsGrid.innerHTML = ideaCardHtml;
      }
    }
  } else {
    renderIdeaCards(savedIdeaCards)
  }
  toggleStarredIdeasBtn();
}


function toggleStarredIdeasBtn() {
  (showStarredIdeaBtn.innerText === "Show Starred Ideas")
  ? showStarredIdeaBtn.innerText = "Show All Ideas" : showStarredIdeaBtn.innerText = "Show Starred Ideas";
}


function searchIdeas(e) {
  var searchString = e.target.value.toLowerCase();
  var filteredIdeas = savedIdeaCards.filter(idea =>
    idea.title.toLowerCase().includes(searchString) || idea.body.toLowerCase().includes(searchString));
  renderIdeaCards(filteredIdeas);
}
