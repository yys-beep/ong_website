// 关联词库
let associations = [
    "以及", "除非", "虽然", "甚至", 
    "并且", "然后", "其实", "另外", 
    "如果", "要是", "原来", "于是", 
    "除此之外", "不止如此", "虽然……但是……", "与其……不如……", 
    "不但……而且……", "要么……要么……", "即……也……", "因为……所以……",
    "一边……一边……", "又……又……", "接着……然后", "只要……就……"
];

let oneWord = [
    "和", "还", "或", "但"
]
const oneWordIndex = Math.floor(Math.random()*6);
let colors = ['red', 'blue', 'green', 'yellow'];

function startGame(){
    document.getElementById("cards-container").style.display = "flex";
    document.getElementById("game-container").style.backgroundColor = "rgba(255, 255, 255, 0.8)";
    document.getElementById("game-container").style.boxShadow = " 0 4px 8px rgba(0, 0, 0, 0.2)";
    document.getElementById("game-container").style.margin = "20px"
    document.getElementById("game-container").classList.remove("startAnimation")
    document.getElementById("next-round").style.display = "inline-block";
    const audio = document.getElementById('backgroundMusic');
        audio.muted = false; // Unmute the audio immediately after loading
        audio.volume = 0.1;
        audio.play().catch(() => console.log('Autoplay blocked. User interaction required.'));
    document.getElementById("start").style.display = "none";
}

// 卡牌颜色对应的图片路径
const cardColors = {
    red: {
        front: "正面（红）.png", // 红色正面图片
        back: "背面（红）.png"    // 红色背面图片
    },
    green: {
        front: "正面（绿）.png", // 绿色正面图片
        back: "背面（绿）.png"    // 绿色背面图片
    },
    blue: {
        front: "正面（蓝）.png", // 蓝色正面图片
        back: "背面（蓝）.png"    // 蓝色背面图片
    },
    yellow: {
        front: "正面（黄）.png", // 黄色正面图片
        back: "背面（黄）.png"    // 黄色背面图片
    }
};


let usedAssociations = []; // 已使用的关联词
let currentRound = 0; // 当前回合


// 打乱数组
function shuffleArray(array) {
    let result = array;
    for (let i = 0; i<array.length; i++) {
        let j = Math.floor(Math.random() * (array.length-1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    console.log(result);
    return result;
}

// 获取随机关联词
function getRandomAssociations() {
    if (usedAssociations.length >= associations.length) {
        alert("所有关联词已使用完毕！");
        return [];
    }
    let selected;
    let availableAssociations = associations.filter(a => !usedAssociations.includes(a));
    if(currentRound===oneWordIndex){
        oneWord = shuffleArray(oneWord);
        availableAssociations.unshift(...oneWord);
        associations.push(...oneWord);
    }
    else{
        availableAssociations = shuffleArray(availableAssociations);
    }
    if(availableAssociations.length>=4){
        selected = availableAssociations.slice(0, 4);
    } // 每次选择4个关联词
    else{
        selected = availableAssociations;
    }
    usedAssociations.push(...selected);
    console.log(usedAssociations);
    return selected;
}

const flipSound = document.getElementById("flipSound");

// 创建卡牌
function createCards() {
    const cardsContainer = document.getElementById('cards-container');
    cardsContainer.innerHTML = ''; // 清空当前卡牌
    const associations = getRandomAssociations();

    // 卡牌颜色列表
    // colors = shuffleArray(colors);
    let usedColor = [];
    associations.forEach((association, index) => {
        const card = document.createElement('div');
        card.classList.add('card');

        //when less than 4 cards
        if(associations.length<=3){
            index = Math.floor(Math.random()*(colors.length-1));
            while(!usedColor.includes(index)){
                usedColor.push(index);
                console.log(index);
                break;
            }
        }

        const color = colors[index]; // 根据索引分配颜色
        card.style.backgroundImage = `url(${cardColors[color].front})`; // 设置背面图片
        
        
        // const mark = document.createElement('div');
        // mark.style.position = "fixed"; // Positioned relative to 'card'
        // mark.style.color = "black";
        // mark.style.fontSize = "100%";
        // mark.style.right = "10px"; // Adjust position inside 'card' using offsets
        // mark.style.top = "10px";
        
        let markNumber;
        if(association.length<3){
            markNumber = 1;
        }
        else{
            markNumber = 2;
        }

        card.dataset.color = color; // 存储卡牌颜色
        card.addEventListener('click', (event) => {
            // 如果卡牌已经翻转，则缩小
            flipSound.play();
            const current = event.target;
            if (card.classList.contains('flipped')) {
                card.style.backgroundImage = `url(${cardColors[color].front})`; // 翻回背面
                card.classList.remove('flipped');
                card.classList.add('flippedBack');
                console.log("flipped class removed");
            } 
            else {
                // 先将所有卡牌恢复原状
                // document.querySelectorAll('.card').forEach(c => {
                //     c.classList.remove('flipped');
                //     c.style.backgroundImage = `url(${cardColors[c.dataset.color].front})`;
                // });
                // 翻转并放大当前卡牌
                let line = ""
                let exist = association.indexOf("……")
                if(exist!==-1){
                    let parts = association.split("……");
                    //line = `+${markNumber}\n\n${parts[0]}……\n\n${parts[1]}……`
                    line = `+${markNumber} 分\n\n${parts[0]}……\n\n${parts[1]}……`
                }else{
                    line = `+${markNumber} 分\n\n${association}`
                }
                card.textContent = line;
                card.style.whiteSpace = "pre-line";
                card.style.backgroundImage = `url(${cardColors[color].back})`; // 显示正面图片
                card.classList.add('flipped');
                card.classList.remove('flippedBack');
                console.log(card);
            }
            const previous = event.target;
        });
        cardsContainer.appendChild(card);
    });
}

// 下一回合按钮事件
document.getElementById('next-round').addEventListener('click', () => {
    if (currentRound < 6) {
        currentRound++;
        createCards();
    } else {
        alert("游戏结束！");
        document.getElementById('next-round').style.display = "none";
    }
});


// 初始化游戏
createCards();