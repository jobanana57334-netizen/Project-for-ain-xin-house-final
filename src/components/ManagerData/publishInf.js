/* const url = 'https://ec-course-api.hexschool.io/v2';
const path = 'anixinwo-publish';

let  house = [
    {
      id: 1,
      title: "六角大樓商宅",
      description:"適合給希望成為前端||後端工程師的你來租,費用很便宜的",
      address: "高雄市前鎮區中華五路 789 號 9 樓之 3",
      typeId: "t1", 
      age: 12,
      size: 20.85,
      mainSize: 14.0, 
      publicSize: 6.85,
      landSize: 3.5, 
      managerPrice: 2000,
      price: 22000,
      img: "src\assets\image\hus-1.png",
      SwiperPicture:[
        "src\assets\image\hus-1.png"
      ],
      isfavor: false,
      isHot: true,
      status: "available", 
      layout: { "room": 5, "hall": 3, "bathroom": 4 },
      floorInfo: { "current": 9, "total": "12" },
      contact: { 
        name: "廖立人", 
        sex: "male", 
        role: "房仲", 
        tel: "0912-345-678",
        picture: "https://randomuser.me/api/portraits/men/32.jpg"
      },
      equipmentIds: [1, 3, 4, 7, 9, 11, 12, 14, 15],
      requirementIds: [16,17,18]
    },
    {
      id: 2,
      title: "卡斯柏辦公大樓",
      description:"屋況良好、交通方便，適合給想要創建工作室的你",
      address: "高雄市苓雅區五福一路 226 號 12 樓",
      typeId: "t2",
      age: 25,
      size: 100.15,
      mainSize: 80.15,
      publicSize: 20.0,
      landSize: 12.0,
      managerPrice: 35000,
      price: 100000,
      img: "src\assets\image\hus-2.png",
      isfavor: false,
      isHot: true,
      status:"available",
      layout: { "room": 10, "hall": 5, "bathroom": 5 },
      floorInfo: { "current":"12+13", "total": "15" },
      contact: { 
        name: "林實惠", 
        sex: "female", 
        role: "房仲", 
        tel: "07-23205188",
        picture: "https://randomuser.me/api/portraits/women/44.jpg"
      },
      equipmentIds: [1,2,3, 4, 7, 9, 11, 12, 14, 15],
      requirementIds: [16, 18]
    },
    {
      id: 3,
      title: "聯強住宅大樓",
      description:"給希望成為YT的你,能夠有一個安靜且不被打擾的空間來好好剪片與拍片",
      address: "台北市大安區復興南路一段 178 號 5 樓之 2",
      typeId: "t3",
      age: 20,
      size: 30.2,
      mainSize: 22.7,
      publicSize: 7.5,
      landSize: 4.8,
      managerPrice: 0,
      price: 40000,
      img: "src\assets\image\hus-3.png",
      isfavor: false,
      isHot: true,
      status:"available",
      layout: { "room": 3, "hall": 2, "bathroom": 2 },
      floorInfo: { "current":"5", "total": "10" },
      contact: { 
        name: "王麗選", 
        sex: "female", 
        role: "房仲", 
        tel: "02-23200188",
        picture: "https://randomuser.me/api/portraits/women/68.jpg"
      },
      equipmentIds: [1,2,3, 4, 6, 7, 8, 9, 10, 11, 14, 15],
      requirementIds: [16]
    },
    {
      id: 4,
      title: "應天透天大樓",
      description:"屋況良好,給有需要上下班卻預算有限的你的其中之一的好選擇",
      address: "台中市西屯區市政北一路 88 號 10 樓之 5",
      typeId: "t3",
      age: 35,
      size: 15.18,
      mainSize: 13.0,
      publicSize: 2.18,
      landSize: 15.18, 
      managerPrice: 0,
      price: 20000,
      img: "/assets/images/4.png",
      isfavor: false,
      isHot: true,
      status:"available",
      parking:false,
      layout: { "room": 2, "hall": 1, "bathroom": 1 },
      floorInfo: { "current":"10", "total": "10" },
      contact: { 
        name: "張大仲", 
        sex: "male", 
        role: "房仲", 
        tel: "05-77220188",
        picture: "https://randomuser.me/api/portraits/men/55.jpg"
      },
      equipmentIds: [3, 4, 5, 7,9, 10, 14, 15],
      requirementIds: [16,17]
    }
];


const houseTitle = document.querySelector('#houseTitle');

const mainSize = document.querySelector('#housePin');
const size = document.querySelector('#houseTotalPin');

const city = document.querySelector('#inputCity');
const dist = document.querySelector('#inputDist');
const road = document.querySelector('#inputAddress');

const age = document.querySelector('#houseAge');

const price = document.querySelector('#rent');
const managerPrice = document.querySelector('#hoaFee');

const contactName = document.querySelector('#name');
const contactNumber = document.querySelector('#tel');


const addHousesBtn = document.querySelector(".addHouses-btn"); */

/* addHousesBtn.addEventListener('click',()=>{
    const obj = {
      id: house.length,
      title: houseTitle.value.trim(),
      description:"適合給希望成為前端||後端工程師的你來租,費用很便宜的",
      address:(city.value + dist.value + road),
      typeId: "t1", 
      age: age.value,
      size: Number(size.value),
      mainSize: Number(mainSize.value), 
      publicSize: 6.85,
      landSize: 3.5, 
      managerPrice: Number(managerPrice.value),
      price: Number(price.value),
      isFavor: false,
      isHot: true,
      status: "available", 
      layout: { "room": 5, "hall": 3, "bathroom": 4 },
      floorInfo: { "current": 9, "total": "12" },
      contact: { 
        name: name.value.trim(), 
        sex: "male", 
        role: "房仲", 
        tel: Number(tel.value),
        picture: "https://randomuser.me/api/portraits/men/32.jpg"
      },
      equipmentIds: [1, 3, 4, 7, 9, 11, 12, 14, 15],
      requirementIds: [16,17,18]
    }
    house.push(obj);
    console.log(house);
 })  */

/* let titleList = ""; */

/* listTab.forEach((title)=>{
  titleList += `<a class="list-group-item list-group-item-action h6" id="${title.id}" data-bs-toggle="list" href="#${title.ariaControls}" role="tab" aria-controls="${title.ariaControls}"><img src=${title.img} alt="Icons-write" class="icon-title">${title.title}​</a>`
}); */
const listGroupRow = document.querySelector(".list-group-row");
console.log(listGroupRow);

/* listTab.forEach((title)=>{
  console.log(title);
})
listGroupRow.innerHTML = titleList; */

/* const active = document.querySelector("a");
console.log(active); */
