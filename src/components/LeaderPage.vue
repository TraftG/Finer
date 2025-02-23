<template>
    <div class="leaderboard-container">
        <div class="level-navigation">
            <BackButton @click="handleBackButton" />
            <button 
                class="arrow-button" 
                @click="changeLevel(-1)" 
                :disabled="isFirstLevel">
                <img src="@/assets/arrowleft.png" alt="←" class="arrow-icon" />
            </button>

            <div v-if="currentLevel === 'Rookie'" class="rookie-banner">
                <img :src="getLevelAvatar('teddy')" alt="Rookie Banner" class="rookie-image" />
                <span>{{ currentLevel }}</span>
            </div>

            <div v-if="currentLevel === 'Explorer'" class="explorer-banner">
                <img :src="getLevelAvatar('explor')" alt="Explorer Banner" class="explorer-image" />
                <span>{{ currentLevel }}</span>
            </div>

            <div v-if="currentLevel === 'Challenger'" class="explorer-banner">
                <img :src="getLevelAvatar('chall')" alt="Challenger Banner" class="explorer-image" />
                <span>{{ currentLevel }}</span>
            </div>
            
            <div v-if="currentLevel === 'Warrior'" class="explorer-banner">
                <img :src="getLevelAvatar('idk')" alt="Warrior Banner" class="explorer-image" />
                <span>{{ currentLevel }}</span>
            </div>

            <div v-if="currentLevel === 'Legend'" class="explorer-banner">
                <img :src="getLevelAvatar('Leg')" alt="Legend Banner" class="explorer-image" />
                <span>{{ currentLevel }}</span>
            </div>
            
            <button 
                class="arrow-button" 
                @click="changeLevel(1)" 
                :disabled="isLastLevel">
                <img src="@/assets/arrow.png" alt="→" class="arrow-icon" />
            </button>
        </div>

        <div v-if="leaderboard.length > 0">
            <h1>Leaderboard</h1>
            <div class="card-container">
                <div v-for="user in filteredLeaderboard" :key="user.id" class="card">
                    <div class="card-content">
                        <img v-if="getLevelAvatar(user.level)" :src="getLevelAvatar(user.level)" alt="Avatar" class="level-avatar" />
                        <div class="card-details">
                            <div class="card-name">{{ user.name }}</div>
                            <div class="card-score">{{ user.score }}</div>
                        </div>
                        <div class="card-rank">#{{ user.rank }}</div>
                    </div>
                </div>              
            </div>
        </div>
        
        <p v-else>Нет данных для этого уровня.</p>
    </div>
</template>

<script>
import { supabase } from "@/services/supabase";
import { BackButton } from 'vue-tg';

export default {

    
    components: {
    BackButton,
  },

    setup() {
        function handleBackButton() {
      window.history.back();
    }

    return {
        handleBackButton,
    }
        
},
    data() {
        return {
            leaderboard: [],
            levels: [
                { name: "Leg", minScore: 0, maxScore: 1000, avatar: require('@/assets/Legend.png')},
                { name: "idk", minScore: 0, maxScore: 1000, avatar: require('@/assets/idk.png')},
                { name: "chall", minScore: 0, maxScore: 1000, avatar: require('@/assets/chall.png')},
                { name: "explor", minScore: 0, maxScore: 1000, avatar: require('@/assets/explor.png')},
                { name: "teddy", minScore: 1000, maxScore: 5000, avatar: require('@/assets/teddy.png')},
                { name: "Rookie", minScore: 1000, maxScore: 5000, avatar: require('@/assets/miner1.png') },
                { name: "Explorer", minScore: 5000, maxScore: 10000, avatar: require('@/assets/miner32.png') },
                { name: "Challenger", minScore: 10000, maxScore: 15000, avatar: require('@/assets/miner4.png') },
                { name: "Warrior", minScore: 15000, maxScore: 20000, avatar: require('@/assets/miner5.png') },
                { name: "Legend", minScore: 20000, maxScore: Infinity, avatar: require('@/assets/miner5.png') }
            ],
            currentLevel: "Rookie"
        };
    },
    computed: {
        filteredLeaderboard() {
            const usersInLevel = this.leaderboard.filter(
                user => user.level === this.currentLevel && user.level !== "teddy" &&
                        user.level !== "explor" && user.level !== "chall" &&
                        user.level !== "idk" && user.level !== "Leg"
            );
            return usersInLevel.map((user, index) => {
                user.rank = index + 1;
                return user;
            });
        },
        isFirstLevel() {
            const filteredLevels = this.levels.filter(level => level.name !== "teddy" && 
                level.name !== "explor" && level.name !== "chall" &&
                level.name !== "idk" && level.name !== "Leg");
            return filteredLevels.findIndex(level => level.name === this.currentLevel) === 0;
        },
        isLastLevel() {
            const filteredLevels = this.levels.filter(level => level.name !== "teddy" && 
                level.name !== "explor" && level.name !== "chall" &&
                level.name !== "idk" && level.name !== "Leg");
            return filteredLevels.findIndex(level => level.name === this.currentLevel) === filteredLevels.length - 1;
        }
    },
    watch: {
        currentLevel() {
            this.fetchLeaderboard();
        }
    },
    created() {
        this.fetchLeaderboard();
    },
    methods: {
        async fetchLeaderboard() {
            try {
                const { data, error } = await supabase
                    .from("users")
                    .select("id, name, score, level")
                    .order("score", { ascending: false });

                if (error) {
                    console.error("Ошибка при получении данных лидерборда:", error);
                } else {
                    this.leaderboard = data.map((user, index) => {
                        if (!user.level) {
                            const level = this.levels.find(
                                l => user.score >= l.minScore && user.score < l.maxScore
                            );
                            user.level = level ? level.name : "Unranked";
                        }
                        user.rank = index + 1;
                        return user;
                    }).filter(user => user.level !== "teddy" && user.level !== "explor" && 
                                     user.level !== "chall" && user.level !== "idk" && user.level !== "Leg"); 
                }
            } catch (error) {
                console.error("Ошибка при запросе данных:", error);
            }
        },
        changeLevel(direction) {
            const currentIndex = this.levels
                .filter(level => level.name !== "teddy" && level.name !== "explor" && 
                                level.name !== "chall" && level.name !== "idk" && level.name !== "Leg")
                .findIndex(level => level.name === this.currentLevel);
            const filteredLevels = this.levels.filter(level => level.name !== "teddy" && 
                level.name !== "explor" && level.name !== "chall" &&
                level.name !== "idk" && level.name !== "Leg");
            const nextIndex = currentIndex + direction;
            if (nextIndex >= 0 && nextIndex < filteredLevels.length) {
                this.currentLevel = filteredLevels[nextIndex].name;
            }
        },
        getLevelAvatar(levelName) {
            const level = this.levels.find(l => l.name === levelName);
            return level ? level.avatar : null;
        }
    }
}
</script>

<style scoped>
body {
    background-color: #000000;
    color: #f6f6f6;
    font-family: 'Outfit', serif;
}

.leaderboard-container {
    background-color: #292929;
    color: #ffffff;
    min-height: 100vh;
    padding: 20px;
    text-align: center;
}

.rookie-banner, .explorer-banner {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.rookie-image, .explorer-image {
    max-width: 100px;
    height: auto;
}

.rookie-banner span, .explorer-banner span {
    font-size: 16px;
    font-weight: bold;
    color: #ffffff;
    margin-top: 10px;
}

h1 {
    color: #adadad;
    font-size: 20px;
    margin-bottom: 20px;
    margin-top: 50px;
}

.level-navigation {
    margin-top: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
}

.arrow-button {
    padding: 50px;
    background-color: #00000000;
    color: #ffffff00;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s;
}

.arrow-button:hover {
    background-color: #ffffff00;
}

.arrow-button:disabled {
    background-color: #88888800;
    cursor: not-allowed;
}

.card-container {
    display: flex;
    flex-direction: column; /* Изменим направление на вертикальное */
    align-items: center;
    gap: 15px;
}


.card {
    background-color: #373636;
    border: 2px solid #373636;
    border-radius: 10px;
    width: 320px;
    height: 45px; /* Установим фиксированную высоту */
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #ffffff;
    font-weight: bold;
    padding: 10px;
    transition: transform 0.2s;
}



.card-content {
    display: flex;
    align-items: center;
    justify-content: flex-start; /* Элементы выравниваются в начале карточки */
    width: 100%;
    box-sizing: border-box;
    gap: 15px; /* Добавляем промежуток между элементами */
}

.level-avatar {
    width: 45px;
    height: 45px;
    border-radius: 50%;
}

.card-details {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: left;
    flex: 1; /* Занимает оставшееся пространство */
}

.card-name {
    font-size: 15px;
    color: #ffffff;
}

.card-score {
    font-size: 13px;
    color: #9f9f9f;
}

.card-rank {
    color: #777777;
    font-size: 13px;
    font-weight: bold;
    margin-left: auto; /* Прижимает ранг к правой стороне карточки */
}

p {
    color: #aaaaaa;
    text-align: center;
    margin-top: 20px;
}



.explorer-banner {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column; /* Размещаем картинку и текст по вертикали */
    justify-content: center;
    align-items: center; /* Центруем содержимое по горизонтали */
}

.explorer-image {
    max-width: 100px;
    height: auto;
}

.explorer-banner span {
    font-size: 16px;
    font-weight: bold;
    color: #ffffff; /* Цвет текста */
    margin-top: 10px; /* Отступ между картинкой и текстом */
}

</style>