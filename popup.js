let file = null

chrome.runtime.sendMessage(
  {action: "setData",},
  (info) => {

    let url = info.srcUrl

    if (info.srcUrl.includes("dcinside")){
      let idx = info.srcUrl.indexOf("?")
      url = "https://images.dcinside.com/viewimage.php" + info.srcUrl.slice(idx)
    }

    fetch(url, {
      method: 'GET',
      headers: {
        "Content-type": "image",
        "User-Agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36",
      },
    }).then(async res => {
      try{
        let type = res.headers.get("Content-Type")
        let blob = await res.blob()
        if (!res.headers.get("Content-Type").includes("image")) {
          let typeIdx = res.headers.get("Content-Disposition").lastIndexOf(".")
          type = "image/" + res.headers.get("Content-Disposition").slice(typeIdx + 1)
          blob = new Blob([blob], {type: type})
        }
        
        let extIdx = type.lastIndexOf("/")
        file = new File([blob], "name." + type.slice(extIdx + 1), {type: type});
  
        var img = document.createElement("img")
        img.style.id = "upload_img"
        img.style.width = "100%"
        img.style.height = "250px"
        img.style.objectFit = "contain"
        img.src = window.URL.createObjectURL(blob)
        var div = document.getElementById("div_upload_img")
        div.appendChild(img)
      } catch {
        alert("지원하지 않는 이미지 형식입니다.")
        window.close()
      }

    })
  }
);


let tagArr = []
let hashTagValue = ""
let code = -1

// 해시태그 핸들링
function handleHashTagChange() {
  var regExp = /[\{\}\[\]\/?.,@;:|\)*~`!^\-+┼<>\$%&\'\"\\\(\=]/gi; 

  const value = document.getElementById("hashtag").value

  // #를 제외한 특문이 들어 있는지
  if(regExp.test(value)){
    document.getElementById("hashtag").value = hashTagValue;
    return
  }
  const arr = value.split(" ")
  for(var i=0; i<arr.length; i++){
    // 단어가 #로 시작하는지
    if (arr[i][0] != "#" && arr[i].length > 0) {
      document.getElementById("hashtag").value = hashTagValue;
      return
    }
  }

  hashTagValue = value
}

// 태그 클릭
function tagOnClick(i) {
  if (!tagArr.includes(i)) {
    document.getElementById(`tag_${i}`).style.opacity = 1
    tagArr.push(i)
  } else {
    document.getElementById(`tag_${i}`).style.opacity = 0.4
    tagArr = tagArr.filter(function(data) {
      return data != i;
    });
  }
  conditionCheck()
}

// 코드 클릭
function codeOnClick(i) {
  if (i != code) {
    code = i
    for(let k=0; k<7; k++){
      if (k == i) {
        document.getElementById(`code_${k}`).style.opacity = 1
      } else {
        document.getElementById(`code_${k}`).style.opacity = 0.4
      }
    }
  }
  conditionCheck()
}

// 컨디션 체크
function conditionCheck() {
  if (tagArr.length > 0 && code != -1 && document.getElementById("password").value.length > 1){
    document.getElementById("submit").disabled = false
  } else {
    document.getElementById("submit").disabled = true
  }
}

function submit() {
  const formData = new FormData();
  formData.append('file', file);
  formData.set('source', JSON.stringify([document.getElementById("source").value]));
  formData.set('hashtag', JSON.stringify([hashTagValue]));
  formData.set('tag', JSON.stringify([tagArr]));
  formData.set('password', document.getElementById("password").value);

  // 업로딩 표시
  let div = document.createElement("div");
  div.style.position = "absolute";
  div.style.width = "100%";
  div.style.height = "100%";
  div.style.left = 0;
  div.style.top = 0;
  div.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  div.style.zIndex = "200";
  div.style.display = "flex";
  let div2 = document.createElement("div");
  div2.style.margin = "auto";
  let span = document.createElement("span");
  span.append("업로딩..")
  span.style.color = "white"
  div2.appendChild(span)
  div.appendChild(div2)
  document.body.appendChild(div)

  document.getElementById("submit").disabled = true
  fetch(`https://nenekomashiro.com/file/${code}/upload/`, {
    method: 'POST',
    body: formData,
  }).then(async res => {
    if (res.status == 201) {
      alert("업로드되었습니다.")
      window.close()
    } else {
      let json = await res.json()
      alert(json.message)
      window.close()
    }
  }).catch((e) => {
    alert("업로드 오류")
    window.close()
  })
}



  
window.onload = function(){
// 패스워드 설정
document
  .getElementById("password")
  .addEventListener('input', async () => {
    conditionCheck()
  });

// 해시태그 핸들러
document
  .getElementById("hashtag")
  .addEventListener('input', async () => {
    handleHashTagChange()
  });

// 업로드 설정
document
  .getElementById("submit")
  .addEventListener('click', async () => {
    submit()
  });
  
// 코드 설정
document
  .getElementById("code_0")
  .addEventListener('click', async () => {
    codeOnClick(0)
  });
document
  .getElementById("code_1")
  .addEventListener('click', async () => {
    codeOnClick(1)
  });
document
  .getElementById("code_2")
  .addEventListener('click', async () => {
    codeOnClick(2)
  });
document
  .getElementById("code_3")
  .addEventListener('click', async () => {
    codeOnClick(3)
  });
document
  .getElementById("code_4")
  .addEventListener('click', async () => {
    codeOnClick(4)
  });
document
  .getElementById("code_5")
  .addEventListener('click', async () => {
    codeOnClick(5)
  });
  document
  .getElementById("code_6")
  .addEventListener('click', async () => {
    codeOnClick(6)
  });

// 태그 설정
document
  .getElementById("tag_1")
  .addEventListener('click', async () => {
    tagOnClick(1)
  });
document
  .getElementById("tag_2")
  .addEventListener('click', async () => {
    tagOnClick(2)
  });
document
  .getElementById("tag_3")
  .addEventListener('click', async () => {
    tagOnClick(3)
  });
document
  .getElementById("tag_4")
  .addEventListener('click', async () => {
    tagOnClick(4)
  });
document
  .getElementById("tag_5")
  .addEventListener('click', async () => {
    tagOnClick(5)
  });
}