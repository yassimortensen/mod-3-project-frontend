document.addEventListener('DOMContentLoaded', function() {


  function getData(){
    fetch ('http://localhost:3000/api/v1/story_stages')
      .then(response => response.json())
      .then(data => displayStage(data))
  }
  getData()

  function displayStage(data, selected=null){
    let stageTitle = document.getElementById('stage-text')
    let descriptionText = document.getElementById('description-text')
    let bodyList = document.getElementById('body-list')
    let buttonDiv = document.getElementById('button-container')
    let mySidenav = document.getElementById('mySidenav')

    let ulList = document.getElementsByTagName('li')
    while (ulList[0]) ulList[0].parentNode.removeChild(ulList[0])

    let buttons = document.getElementsByClassName('card')
    while (buttons[0]) buttons[0].parentNode.removeChild(buttons[0])

    // var elements = document.getElementsByTagName('label')
    // while (elements[0]) elements[0].parentNode.removeChild(elements[0])

    let stageArray = [];
    if (selected){
      data.forEach(object => {
        if (object.stage === selected){
          stageArray.push(object)
        }
      })
      // description/long prompt text
      descriptionText.innerText = stageArray[0].description
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
        //building button for back of card
        let step = document.createElement('a')
        step.innerText = selected
        mySidenav.appendChild(step)
        let button = document.createElement('button')
        button.id = `${object.button}`
        button.innerText = object.body
        button.addEventListener("click", function(){
          displayStage(data, event.target.id)
        })
        back.appendChild(button)
        // finishing card for flip
        card.appendChild(front)
        card.appendChild(back)
        $(".card").flip()
      })


    } else {
      data.forEach(object => {
        if (object.stage === "top"){
          return stageArray.push(object)
        }
      })
      // description/long prompt text
      descriptionText.innerText = stageArray[0].description
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
        //building button for back of card
        let button = document.createElement('button')
        button.id = `${object.button}`
        button.innerText = object.body
        button.addEventListener("click", function(){
          displayStage(data, event.target.id)
        })
        back.appendChild(button)

        // finishing card for flip
        card.appendChild(front)
        card.appendChild(back)
        $(".card").flip()
      })
    }
  }
})
