document.addEventListener('DOMContentLoaded', function() {

  function getData(){
    fetch ('http://localhost:3000/api/v1/story_stages')
      .then(response => response.json())
      .then(data => displayData(data))
  }
  getData()

  function displayData(data){
    let stageTitle = document.getElementById('stage-text')
    let descriptionText = document.getElementById('description-text')
    let bodyList = document.getElementById('body-list')
    let buttonDiv = document.getElementById('button-container')

    stageTitle.innerText = data[0].stage
    descriptionText.innerText = data[0].description

    data.forEach(element => {
    	if (element.stage === "hide"){
        let li = document.createElement('li')
    		li.innerText = element.body
        bodyList.appendChild(li)

        let button = document.createElement('button')
        let image = document.createElement('img')
        let buttonText = document.createElement('p')
        image.src = element.pic.picUrl
        buttonText.innerText = element.body
        button.appendChild(image)
        button.appendChild(buttonText)
        buttonDiv.appendChild(button)

      }
    })

  }

})
