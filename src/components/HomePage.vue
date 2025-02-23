<template>
  <div class="background">
    <div class="top-container"></div>

  
 

    <!-- Потраченная энергия с логотипом -->
    <div class="energy-spent-display">
      <img src="../assets/nft.png" alt="Energy Icon" class="energy-icon" />
      {{ energySpent.toFixed(4) }}
    </div>

    <img :src="centerImage" alt="NFT Image" class="center-image" />
    <button class="start-button" @click="toggleButton" :class="{ 'stop-button': isStarted }">{{ buttonText }}</button>

    <div class="bottom-bar">
      <!-- Квадратная кнопка слева от energy bar -->
      <button class="square-button">
        <img src="../assets/Task.png" alt="Button Icon" class="button-image" />
        <span class="button-text">tasks</span>
      </button>

      <!-- Добавим вторую квадратную кнопку -->
      <button class="square-button second">
        <img src="../assets/user.png" alt="Button Icon" class="button-image" />
        <span class="button-text">frens</span>
      </button>

      <!-- Первая кнопка справа -->
      <button class="square-button right">
        <router-link to="/wallet" class="router-link-active">
          <img src="../assets/wallet.png" alt="Button Icon" class="button-image" />
          <span class="button-text">wallet</span>
        </router-link>
      </button>

      <!-- Вторая кнопка справа -->
      <button class="square-button right second">
        <img src="../assets/boost.png" alt="Button Icon" class="button-image" />
        <span class="button-text">boost</span>
      </button>

      <div class="energy-bar-container">
        <div class="energy-bar-background">
          <div class="energy-bar" :style="{ width: progress + '%' }"></div>
        </div>
        <div class="energy-text">{{ energyRemaining.toFixed(1) }}/100</div>

        <router-link to="/leaderboard" class="router-link"> 
          <div class="Level-Design">{{ playerLevel }}
          
            <img src="../assets/arrow.png" alt="" class="arrow">
          
          </div>
        </router-link>
        
    
      </div>
    </div>
  </div>
</template>

  
  <script>
  import { supabase } from '@/services/supabase';
  import { useTelegram } from '@/services/telegram';


  
  const { user } = useTelegram();
  console.log(user?.id);  // Для проверки ID
  const MY_ID = parseInt(user?.id ?? '4252', 10);
  console.log('User ID:', MY_ID); 
  const userName = user?.first_name ?? 'Trieyengle'; // Получаем имя пользователя
  

  
 export async function getOrCreateUser () {
  try {
    // Проверяем, существует ли пользователь в базе данных
    const { data: existingUsers, error } = await supabase
      .from('users')
      .select()
      .eq('telegram', MY_ID);

    if (error) {
      console.error('Ошибка при получении пользователя:', error.message);
      return null;
    }

    // Если пользователь существует, обновляем его имя
    if (existingUsers.length > 0) {
      const existingUser  = existingUsers[0];

      // Обновляем имя пользователя, если оно отличается
      if (existingUser .name !== userName) {
        const { error: updateError } = await supabase
          .from('users')
          .update({ name: userName }) // Обновляем имя
          .eq('id', existingUser .id); // Указываем, какого пользователя обновляем

        if (updateError) {
          console.error('Ошибка при обновлении имени пользователя:', updateError.message);
        }
      }

      return existingUser ; // Возвращаем существующего пользователя
    }

    // Если пользователя нет, создаем нового
    const newUser  = {
      telegram: MY_ID,
      name: userName, // Сохраняем имя пользователя
      friends: {},
      tasks: {},
      score: 0,
      energy: 100
    };

    const { data: insertedUser , error: insertError } = await supabase
      .from('users')
      .insert(newUser )
      .select()
      .single();

    if (insertError) {
      console.error('Ошибка при создании пользователя:', insertError.message);
      return null;
    }

    return insertedUser ; // Возвращаем нового пользователя
  } catch (error) {
    console.error('Неизвестная ошибка при создании/получении пользователя:', error);
    return null;
  }
}
  
  export default {
    name: "HomePage",


    
    data() {
      return {
        playerRank: 0,
        isStarted: false,
        progress: 100,
        energyRemaining: 100,
        energySpent: 0,
        interval: null,
        centerImage: require('@/assets/miner1.png'),
        playerLevel: "Rookie", // Начальный уровень
      };
    },
    computed: {
      buttonText() {
        return this.isStarted ? "Stop" : "Start";
      },
    },
    methods: {

      updatePlayerLevel() {
    if (this.energySpent < 1000) {
      this.playerLevel = "Rookie";
    } else if (this.energySpent < 5000) {
      this.playerLevel = "Explorer";
    } else if (this.energySpent < 10000) {
      this.playerLevel = "Challenger";
    } else if (this.energySpent < 15000) {
      this.playerLevel = "Warrior";
    } else if (this.energySpent < 20000) {
      this.playerLevel = "Legend";
    } else {
      this.playerLevel = "Legend";
    }

    this.savePlayerLevelToDatabase(this.playerLevel);

  },

  async savePlayerLevelToDatabase(level) {
  try {
    const { data } = await supabase
      .from('users')
      .select('id')
      .eq('telegram', MY_ID)
      .single();

    if (data) {
      await supabase.from('users').update({ level }).eq('telegram', MY_ID);
    } else {
      await supabase.from('users').insert([{ telegram: MY_ID, level }]);
    }
  } catch (err) {
    console.error('Ошибка при сохранении уровня игрока:', err);
  }
},

      async updateEnergyData(energy) {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('id')
            .eq('telegram', MY_ID)
            .single();
  
          if (error && error.code !== 'PGRST116') {
            console.error('Ошибка при получении данных:', error.message);
            return;
          }
  
          if (data) {
            await supabase.from('users').update({ energy }).eq('telegram', MY_ID);
          } else {
            await supabase.from('users').insert([{ telegram: MY_ID, energy }]);
          }
        } catch (err) {
          console.error('Неизвестная ошибка:', err);
        }
      },
  
      async fetchEnergyData() {
    try {
      const { data } = await supabase
        .from('users')
        .select('energy, score')
        .eq('telegram', MY_ID)
        .single();

      if (data) {
        this.energyRemaining = data.energy;
        this.energySpent = data.score || 0;
        this.progress = this.energyRemaining;

        // Обновление уровня при загрузке
        this.updatePlayerLevel();

        if (this.energySpent >= 1000) {
          this.changeBackgroundAndImage();
        }
        if (this.energySpent >= 5000) {
          this.chanimage3();
        }
        if (this.energySpent >= 10000) {
          this.chanimage4();
        }

        if (this.energySpent >= 15000) {
          this.chanimage5();
        }
      } else {
        await this.updateEnergyData(100);
      }
    } catch (err) {
      console.error('Ошибка при получении данных:', err);
    }
  },

  
      toggleButton() {
        this.isStarted = !this.isStarted;
        this.isStarted ? this.startMining() : this.stopMining();
      },
  
      squareButtonClick() {
        console.log('Square button clicked!');
        // Добавьте функциональность кнопки здесь
      },
  
      startMining() {
    this.interval = setInterval(() => {
      if (this.energyRemaining > 0) {
        const increment = 0.16436;

        this.energyRemaining = Math.max(0, (this.energyRemaining - increment).toFixed(5));
        this.progress = this.energyRemaining;
        this.energySpent = parseFloat((this.energySpent + increment).toFixed(5));

        // Обновление уровня игрока
        this.updatePlayerLevel();

        if (this.energySpent >= 1000 && this.centerImage !== require('@/assets/miner2.png')) {
          this.changeBackgroundAndImage();
        }

        if (this.energySpent >= 5000 && this.centerImage !== require('@/assets/miner32.png')) {
          this.chanimage3();
        }

        if (this.energySpent >= 10000 && this.centerImage !== require('@/assets/miner4.png')) {
          this.chanimage4();
        }

        if (this.energySpent >= 15000 && this.centerImage !== require('@/assets/miner5.png')) {
          this.chanimage5();
        }

        this.updateEnergyData(this.energyRemaining);
      } else {
        this.stopMining();
      }
    }, 2000);
  },

      chanimage3() {
        document.querySelector('.background').style.background = 'linear-gradient(to bottom, #327EA5, #327EA5 )';
        this.centerImage = require('@/assets/miner32.png')
      },

      chanimage4() {
        document.querySelector('.background').style.background = 'linear-gradient(to bottom, #D43B3B, #D43B3B )';
        this.centerImage = require('@/assets/miner4.png')
      }, 

      chanimage5() {
        document.querySelector('.background').style.background = 'linear-gradient(to bottom, #F18928, #F18928 )';
        this.centerImage = require('@/assets/miner5.png')
      }, 

      changeBackgroundAndImage() {
        document.querySelector('.background').style.background = 'linear-gradient(to bottom, #7FCA6A, #7FCA6A)';
        this.centerImage = require('@/assets/miner2.png');
      },
  
      stopMining() {
        clearInterval(this.interval);
        this.interval = null;
        this.updateEnergyData(this.energyRemaining);
        this.saveScoreToDatabase(this.energySpent);
      },
  
      async saveScoreToDatabase(energySpent) {
        try {
          const { data } = await supabase
            .from('users')
            .select('id')
            .eq('telegram', MY_ID)
            .single();
  
          if (data) {
            await supabase.from('users').update({ score: energySpent }).eq('telegram', MY_ID);
          } else {
            await supabase.from('users').insert([{ telegram: MY_ID, score: energySpent }]);
          }
        } catch (err) {
          console.error('Ошибка при сохранении данных:', err);
        }
      },
      requestFullscreen() {
      if (window.Telegram && window.Telegram.WebApp && typeof window.Telegram.WebApp.requestFullscreen === 'function') {
        window.Telegram.WebApp.requestFullscreen();
      } else {
        console.warn("requestFullscreen is not supported in this version of the Telegram Web App SDK.");
      }
    },

    async fetchPlayerRank() {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('rank') // Предполагается, что поле называется "rank"
          .eq('telegram', MY_ID)
          .single();

        if (error) {
          console.error('Ошибка при загрузке ранга:', error.message);
          return;
        }

        if (data && data.rank !== undefined) {
          this.playerRank = data.rank; // Устанавливаем ранк в данных
        }
      } catch (err) {
        console.error('Ошибка при получении ранга:', err);
      }
    },


  },




  

  async mounted() {
    this.fetchEnergyData();
    await getOrCreateUser(); 
    this.fetchEnergyData();
    this.requestFullscreen();
  },
};
  </script>
  
  <style>
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    font-family: 'Balsamiq Sans', serif;
  }
  
  .background {
    background: linear-gradient(to bottom, #EEAEBC, #EEAEBC);
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    flex-direction: column;
  }
  
  .energy-spent-display {
    position: absolute;
    top: 120px;
    font-size: 1.5rem;
    color: #ffffff;
    font-weight: bold;
    background-color: rgba(0, 0, 0, 0.124);
    border-radius: 40px;
    padding: 7px 18px;
    text-align: center;
  }
  
  .energy-icon {
    width: 24px;
    height: 24px;
    margin-right: 8px;
    vertical-align: middle;
    filter: invert(100%) brightness(100%) contrast(100%);
    transform: translateY(-2px);  /* Поднимет изображение немного вверх */
  }
  
  
  .center-image {
    max-width: 80%;
    max-height: 80%;
    object-fit: contain;
    border-radius: 42px;
  }
  
  .start-button {
    position: absolute;
    bottom: 150px;
    padding: 10px 60px;
    background-color: #A79CF8;
    color: white;
    font-size: 1.2rem;
    border: none;
    border-radius: 23px;
    cursor: pointer;
  }
  
  .stop-button {
    background-color: #fc8a8a;
  }
  
  .bottom-bar {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 150px; /* Уменьшаем ширину */
    height: 6px;
    display: flex;
    align-items: center;
  }
  
  .energy-bar-container {
    width: 115%;
    height: 100%;
    position: relative;
  }
  
  .energy-bar-background {
    width: 100%;
    height: 6px;
    background-color: #00000038;
    border-radius: 10px;
  }
  
  .energy-bar {
    height: 6px;
    width: 50%; /* Уменьшаем длину бар, например, до 50% */
    background-color: #ffffff;
    border-radius: 10px;
  }
  
  .energy-text {
    font-size: 0.7rem;
    color: #ffffff;
    position: absolute;
    top: 10px;
    right: 55px; /* Корректируем расположение текста */
  }
  
  .square-button {
    width: 50px;
    height: 60px;
    position: absolute;
    right: 200px;  /* Расположение кнопки справа */
    bottom: 60px;  /* Первая кнопка справа */
    border: none;  /* Убираем рамку */
    border-radius: 10px;
    background-color: rgba(0, 0, 0, 0.176);  /* Цвет фона кнопки */
    display: flex;
    flex-direction: column;  /* Размещаем элементы вертикально */
    align-items: center;  /* Центрируем элементы по горизонтали */
    justify-content: center;  /* Центрируем элементы по вертикали */
  }
  
  .square-button.second {
    bottom: -10px;  /* Вторая кнопка будет ниже */
  }
  
  .square-button.right {
    position: absolute;
    right: -100px;  /* Отступ с правого края */
    bottom: 60px;  /* Первая кнопка справа */
    text-decoration: none;
  }
  
  .square-button.right.second {
    bottom: -10px;  /* Вторая кнопка справа будет ниже */
  }
  
  .button-image {
    width: 20px;  /* Устанавливаем размер изображения */
    height: 30px;
    object-fit: contain;  /* Сохраняем пропорции изображения */
  }
  
  .button-text {
    font-size: 11px;  /* Размер текста */
    font-weight: bold;
    color: #ffffff;  /* Цвет текста */
    margin-top: 1px;  /* Отступ сверху от изображения */
  }
  .router-link {
  text-decoration: none; /* Убирает подчёркивание */
  color: inherit; /* Устанавливает наследование цвета */
}

.router-link-active {
  text-decoration: none; /* Убирает подчёркивание для активной ссылки */
}

.Level-Design{
  color: #ffffff;
  font-weight: bold;
  font-size: 14px;
  margin-top: -30px;
  margin-left: 50px;
}

.arrow{
  height: 18px;
  position: absolute;
  margin-top: 0px;
  margin-left: 10px;
}

  
</style>
  