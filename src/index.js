
document.addEventListener('DOMContentLoaded', function() {

  let formListener = document
    .getElementById('user-form')
    .addEventListener("submit", event => {
      event.preventDefault()

      let username = document.getElementById('form-name').value
      let character = document.getElementById('form-character').value
      let food = document.getElementById('form-food').value
      let job = document.getElementById('form-job').value
      let animal = document.getElementById('form-animal').value
      createNewUser(username, character, food, job, animal)
    })

  function createNewUser(username, character, food, job, animal){
    fetch ('http://localhost:3000/api/v1/users', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: username,
        characterName: character,
        favFood: food,
        firstJob: job,
        favAnimal: animal
      })
    })
      .then(response => response.json())
      .then(user => getData(user))

      hideForm()
  }

  function hideForm(){
    let form = document.getElementById('user-form')
    form.remove()
  }

  function getData(user){

    fetch ('http://localhost:3000/api/v1/story_stages')
      .then(response => response.json())
      .then(data => displayStage(data, user))
  }

  function displayStage(data, user, selected=null){
    let stageTitle = document.getElementById('stage-text')
    let descriptionText = document.getElementById('description-text')
    let bodyList = document.getElementById('body-list')
    let buttonDiv = document.getElementById('button-container')


    let ulList = document.getElementsByTagName('li')
    while (ulList[0]) ulList[0].parentNode.removeChild(ulList[0])

    let buttons = document.getElementsByClassName('card')
    while (buttons[0]) buttons[0].parentNode.removeChild(buttons[0])

    function editText(user,textToEdit){
      if (textToEdit.includes("`${characterName}`")){
        textToEdit = textToEdit.replace("`${characterName}`", user.characterName)
        if (textToEdit.includes("`${firstJob}`")){
          textToEdit = textToEdit.replace("`${firstJob}`",user.firstJob)
          if (textToEdit.includes("`${favFood}`")){
            textToEdit = textToEdit.replace("`${favFood}`", user.favFood)
          }
        }
      } else if (textToEdit.includes("`${firstJob}`")) {
        textToEdit = textToEdit.replace("`${firstJob}`",user.firstJob)
      } else if (textToEdit.includes("`${favFood}`")){
        textToEdit = textToEdit.replace("`${favFood}`", user.favFood)
      }
      return textToEdit
    }

    let stageArray = [];
    if (selected){

      data.forEach(object => {
        if (object.stage === selected){
          stageArray.push(object)
        }
      })
      document.getElementById('previous_steps').style.visibility="visible"
      // description/long prompt text
      descriptionText.innerText = editText(user,stageArray[0].description)
      // bulleted option text
      stageArray.forEach(object => {
        let li = document.createElement('li')
        li.innerText = editText(user, object.body)
        bodyList.appendChild(li)
        // building cards for flip
        let card = document.createElement('div')
        card.setAttribute("class","card")
        buttonDiv.appendChild(card)
        //building front and back of card
        let front = document.createElement('div')
        let back = document.createElement('div')
        front.setAttribute("class", "front")
        back.setAttribute("class", "back")
        //building image for front of card
        let img = document.createElement('img')
        img.setAttribute("src",`${object.pic.picUrl}`)
        front.appendChild(img)
        //building button for back of card
        // let step = document.createElement('a')
        // step.innerText = selected
        // mySidenav.appendChild(step)
        let button = document.createElement('button')
        button.id = editText(user,`${object.button}`)
        button.innerText = editText(user,object.body)
        button.addEventListener("click", function(){
          displayStage(data, user, event.target.id)
          persistStory(user.id, object.id)
        })
        back.appendChild(button)
        // finishing card for flip
        card.appendChild(front)
        card.appendChild(back)
        $(".card").flip({
          trigger:'hover'
        })
      })
    } else {
      data.forEach(object => {
        if (object.stage === "top"){
          return stageArray.push(object)
        }
      })
      //welcome header
      document.getElementById('welcome').innerText=`Welcome, ${user.name}`
      // description/long prompt text
      descriptionText.innerText = editText(user,stageArray[0].description)
      // bulleted option text
      stageArray.forEach(object => {
        let li = document.createElement('li')
        li.innerText = object.body
        bodyList.appendChild(li)
        // building cards for flip
        let card = document.createElement('div')
        card.setAttribute("class","card")
        buttonDiv.appendChild(card)
        //building front and back of card
        let front = document.createElement('div')
        let back = document.createElement('div')
        front.setAttribute("class", "front")
        back.setAttribute("class", "back")
        //building image for front of card
        let img = document.createElement('img')
        img.setAttribute("src",`${object.pic.picUrl}`)
        front.appendChild(img)
        //building button for back of card
        let button = document.createElement('button')
        button.id = `${object.button}`
        button.innerText = object.body

        button.addEventListener("click", function(){
          displayStage(data, user, event.target.id)
          persistStory(user.id, object.id)
        })

        back.appendChild(button)
        // finishing card for flip
        card.appendChild(front)
        card.appendChild(back)
        $(".card").flip({
          trigger:'hover'
        })
        // attempts at animating the box shadow
        // $(".card").addClass('shadow-pulse');
        // $(".card").on('cssanimationend', function(){
        //   $(".card").removeClass('shadow-pulse');
        //   // do something else...
        // });
        // $(".card").animate({
        //   'trigger': 'hover',
        //   'boxShadowX': '10px',
        //   'boxShadowY':'10px',
        //   'boxShadowBlur': '20px'
        // });
      })
    }
  }

  function persistStory(user, object_id){
    fetch ('http://localhost:3000/api/v1/user_stories', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        user_id: user,
        story_stage_id: object_id
      })
    })
      .then(response => response.json())
      .then(userStory => addToSideBar(userStory))
  }

  function addToSideBar(userStory){

    if (userStory.story_stage.nextStep === "#top"){
      let sideBarElements = document.getElementsByClassName('sidebar-element')
      while (sideBarElements[0]) sideBarElements[0].parentNode.removeChild(sideBarElements[0])
    }

    let step = document.createElement('a')
    step.setAttribute("class", "sidebar-element")
    let mySidenav = document.getElementById('mySidenav')
    step.innerText = userStory.story_stage.body
    mySidenav.appendChild(step)

  }

  // let ulList = document.getElementsByTagName('li')
  // while (ulList[0]) ulList[0].parentNode.removeChild(ulList[0])

})
