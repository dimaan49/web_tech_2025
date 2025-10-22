let dishes = [
    //soups
    
    {
        keyword: "borscht",
        name: "Борщ",
        price: 180,
        category: "soup",
        count: "350г",
        image: "./images/борщ.jpg",
        kind: "meat"
    },
    {
        keyword: "rassolnik",
        name: "Рассольник с курицей", 
        price: 180,
        category: "soup",
        count: "350г",
        image: "./images/рассольник_скурицей.jpeg",
        kind: "meat" 
    },
    {
        keyword: "potato-soup",
        name: "Картофельный суп", 
        price: 130,
        category: "soup",
        count: "350г",
        image: "./images/суп_картофельный.jpg",
        kind: "veg" 
    },
    {
        keyword: "soup-solyanka",
        name: "Суп солянка", 
        price: 240,
        category: "soup",
        count: "400г",
        image: "./images/суп_солянка.jpg",
        kind: "meat" 
    },
    {
        keyword: "semga soup",
        name: "Суп из семги со сливками",
        price: 350,
        category: "soup", 
        count: "350г",
        image: "./images/Суп_семга.jpg",
        kind: "fish" 
    },
    {
        keyword: "uha",
        name: "Уха по финкси",
        price: 170,
        category: "soup",
        count: "350г", 
        image: "./images/уха_пофински.jpg",
        kind: "fish" 
    },
    // main

     {
        keyword: "chicen_potato",
        name: "Курица с картошкой",
        price: 180,
        category: "main",
        count: "300г",
        image: "./images/курица_с_картошкой.jpg",
        kind: "meat" 
    },
    {
        keyword: "pasta_meat",
        name: "Макароны с мясом",
        price: 180,
        category: "main",
        count: "300г",
        image: "./images/макароны_с_мясом.jpg",
        kind: "meat" 
    },
    {
        keyword: "fish_potato",
        name: "Рыба с картошкой",
        price: 180,
        category: "main",
        count: "300г", 
        image: "./images/рыба_с_картошкой.jpg",
        kind: "fish" 
    },
    {
        keyword: "fish_rice",
        name: "Рыба с рисом",
        price: 180,
        category: "main",
        count: "300г",
        image: "./images/рыба_рис.jpg",
        kind: "fish" 
    },
    {
        keyword: "fish_lemon", 
        name: "Рыба с лимоном",
        price: 180,
        category: "main",
        count: "300г",
        image: "./images/рыба_лимон.jpg",
        kind: "fish" 
    },
    {
        keyword: "vegetables_cutlets",
        name: "Кабачковые котлеты",
        price: 160,
        category: "main",
        count: "300г",
        image: "./images/котлеты_кабачковые.jpg",
        kind: "veg" 
    },

    //salads

    {
        keyword: "Olivie",
        name: "Салат оливье",
        price: 280,
        category: "starter", 
        count: "250г",
        image: "./images/салат_оливье.jpg",
        kind: "meat" 
    },
    {
        keyword: "beef salad",
        name: "Салат с говядиной",
        price: 190,
        category: "starter",
        count: "250г",
        image: "./images/салат_с_говядиной.jpg",
        kind: "meat" 
    },
        
    {
        keyword: "seledka pod shuboy",
        name: "Селедка под шубой",
        price: 220,
        category: "starter",
        count: "250г",
        image: "./images/селедка_под_шубой.jpg",
        kind: "fish" 
    },
    {
        keyword: "nicoise",
        name: "Нисуаз",
        price: 210,
        category: "starter",
        count: "250г",
        image: "./images/нисуаз.jpg",
        kind: "fish" 
    },

    {
        keyword: "vinaigrette",
        name: "Винегрет",
        price: 160,
        category: "starter",
        count: "200г",
        image: "./images/винегрет.jpg", 
        kind: "veg" 
    },

    {
        keyword: "caprese",
        name: "Капрезе",
        price: 160,
        category: "starter",
        count: "200г",
        image: "./images/капрезе.jpg", 
        kind: "veg" 
    },

    
    {
        keyword: "tea oblepiha",
        name: "Чай облепиховый",
        price: 100,
        category: "drink",
        count: "0.5л",
        image: "./images/чай_облепиховый.jpg",
        kind: "hot" 
    },
    {
        keyword: "matcha",
        name: "Матча",
        price: 120,
        category: "drink",
        count: "0.3л",
        image: "./images/матча.jpg",
        kind: "hot" 
    },
    {
        keyword: "glintvane",
        name: "Глинтвейн",
        price: 80,
        category: "drink",
        count: "0.3л",
        image: "./images/глинтвейн.jpg",
        kind: "hot" 
    },
    {
        keyword: "mojito",
        name: "Мохито",
        price: 80,
        category: "drink", 
        count: "0.3л",
        image: "./images/мохито.jpg",
        kind: "cold" 
    },
    {
        keyword: "mors",
        name: "Морс брусничный",
        price: 90,
        category: "drink",
        count: "0.5л",
        image: "./images/морс_брусничный.jpg",
        kind: "cold" 
    },
    {
        keyword: "tea_limon_cold",
        name: "Холодный чай с лимоном",
        price: 110,
        category: "drink",
        count: "0.2л", 
        image: "./images/чай_холодный_лимон.jpg",
        kind: "cold" 
    },

    //dessert
    {
        keyword: "red velvet",
        name: "Красный бархату",
        price: 180,
        category: "dessert",
        count: "150г",
        image: "./images/красный_бархат.jpg",
        kind: "large" 
    },
    {
        keyword: "moti",
        name: "Пирожное моти",
        price: 200,
        category: "dessert",
        count: "180г",
        image: "./images/моти.jpg",
        kind: "small" 
    },
    {
        keyword: "cheesecacke",
        name: "Чизкейк",
        price: 160,
        category: "dessert",
        count: "120г", 
        image: "./images/чизкейк.jpg",
        kind: "large" 
    },
    {
        keyword: "donut",
        name: "Пончики",
        price: 140,
        category: "dessert",
        count: "100г",
        image: "./images/пончики.jpg",
        kind: "medium" 
    },
    {
        keyword: "oladii",
        name: "Оладьи",
        price: 150,
        category: "dessert",
        count: "200г",
        image: "./images/оладьи.jpg",
        kind: "medium" 
    },
    {
    keyword: "ice_cream",
        name: "Мороженое",
        price: 160,
        category: "dessert",
        count: "120г", 
        image: "./images/мороженное.jpg",
        kind: "small" 
    }
  
];