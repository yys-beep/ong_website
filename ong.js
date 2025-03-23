// 关联词库
const associations = [
    "一边……一边……", "即使……也……", "不仅……还……", "不是……而是……", 
    "虽然……但是……", "只要……就……", "不管……都……", "宁可……也不……", 
    "一……就……", "不但……而且……", "既然……就……", "尽管……也……", 
    "如果……就……", "无论……都……", "因为……所以……", "也……也……", 
    "不但不……反而……", "与其……不如……", "尽管……却……", "倘若……便……"
];

function startGame(){
    document.getElementById("cards-container").style.display = "flex";
    document.getElementById("game-container").style.backgroundColor = "rgba(255, 255, 255, 0.8)";
    document.getElementById("game-container").style.boxShadow = " 0 4px 8px rgba(0, 0, 0, 0.2)";
    document.getElementById("game-container").classList.remove("startAnimation")
    document.getElementById("next-round").style.display = "inline-block";
    document.getElementById("start").style.display = "none";
    const audio = document.getElementById('backgroundMusic');
        audio.muted = false; // Unmute the audio immediately after loading
        audio.play().catch(() => console.log('Autoplay blocked. User interaction required.'));
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
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

let count = 0;
// 获取随机关联词
function getRandomAssociations() {
    if (usedAssociations.length >= associations.length) {
        alert("所有关联词已使用完毕！");
        return [];
    }

    let availableAssociations = associations.filter(a => !usedAssociations.includes(a));
    shuffleArray(availableAssociations);
    let selected = availableAssociations.slice(0, 4); // 每次选择4个关联词
    usedAssociations.push(...selected);
    return selected;
}

// 创建卡牌
function createCards() {
    const cardsContainer = document.getElementById('cards-container');
    cardsContainer.innerHTML = ''; // 清空当前卡牌
    const associations = getRandomAssociations();

    // 卡牌颜色列表
    const colors = ['red', 'green', 'blue', 'yellow'];

    associations.forEach((association, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        const color = colors[index]; // 根据索引分配颜色
        card.style.backgroundImage = `url(${cardColors[color].front})`; // 设置背面图片
        console.log(association);
        card.textContent = association;
        card.dataset.color = color; // 存储卡牌颜色
        card.addEventListener('click', (event) => {
            // 如果卡牌已经翻转，则缩小
            const current = event.target;
            if (card.classList.contains('flipped')) {
                if(current === previous){
                    card.style.backgroundImage = `url(${cardColors[color].front})`; 
                }
                else{
                    card.style.backgroundImage = `url(${cardColors[color].back})`; // 翻回背面
                    card.classList.remove('flipped');
                }
                
            } 
            else {
                // 先将所有卡牌恢复原状
                // document.querySelectorAll('.card').forEach(c => {
                //     c.classList.remove('flipped');
                //     c.style.backgroundImage = `url(${cardColors[c.dataset.color].front})`;
                // });
                // 翻转并放大当前卡牌
                card.classList.add('flipped');
                card.style.backgroundImage = `url(${cardColors[color].back})`; // 显示正面图片
            }
            const previous = event.target;
        });
        cardsContainer.appendChild(card);
    });
}

// 下一回合按钮事件
document.getElementById('next-round').addEventListener('click', () => {
    if (currentRound < 4) {
        currentRound++;
        createCards();
    } else {
        alert("游戏结束！");
        document.getElementById('next-round').style.display = "none";
    }
});


// 初始化游戏
createCards();
