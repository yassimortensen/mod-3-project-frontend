document.addEventListener('DOMContentLoaded', function() {

  function hideForm(){
    let form = document.getElementById('user-form')
    form.remove()
  }

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
      .then(data => displayData(data, user))
  }

  function displayData(data, user){
    let stageTitle = document.getElementById('stage-text')
    let descriptionText = document.getElementById('description-text')
    let bodyList = document.getElementById('body-list')
    let buttonDiv = document.getElementById('button-container')

    stageTitle.innerText = data[0].stage
    descriptionText.innerText = data[0].description


    data.forEach(element => {
    	if (element.stage === "top"){
        let li = document.createElement('li')
    		li.innerText = element.body
        bodyList.appendChild(li)


        // let card = document.createElement('div')
        // buttonDiv.appendChild(card)
        // card.setAttribute("class","card")
        //
        // let front = document.createElement('div')
        //
        // let image = document.createElement('img')
        //
        // front.setAttribute("class", "front")
        // image.src = element.pic.picUrl
        // front.appendChild(image)
        //
        // let back = document.createElement('div')
        //
        // let button = document.createElement('button')
        // back.setAttribute("class", "back")
        // button.setAttribute("type", "button")
        // button.setAttribute("name", "button")
        //
        //
        // button.id = `${element.body}`
        // button.innerText = element.body
        // back.appendChild(button)
        //
        // card.appendChild(front)
        // card.appendChild(back)


        $(".card").flip()

      }
    })

  }

})
