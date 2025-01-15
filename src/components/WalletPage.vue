<template>
    <div class="wallet-container">
      <div class="header">
        <img src="../assets/utyaduck_agadaweaaladvqo.gif" alt="Wallet Animation" />
      </div>
      <div class="nft-collection">NFT Collection</div>
      <div class="wallet-address">Wallet

      </div>
      <!-- Add TonConnectButton here -->
      <TonConnectButton />
      <span>{{ userFriendlyAddress }}</span>
    
    </div>
  </template>
  
  <script>

 import { TonConnectButton, useTonAddress } from 'ton-ui-vue';
  export default {
    name: "WalletPage",

    setup() {
    const userFriendlyAddress = useTonAddress();
    const rawAddress = useTonAddress(false);

    return {
      userFriendlyAddress,
      rawAddress
    }
  },

    components: {
      TonConnectButton
    }
  };
  </script>
  
  <style scoped>
  .wallet-container {
    text-align: center;
    padding: 20px;
    background-color: #18181b; /* Устанавливаем чёрный фон */
    height: 100vh; /* Высота контейнера на весь экран */
    color: white; /* Белый текст */
    display: flex;
    flex-direction: column;
    justify-content: flex-start; /* Размещаем элементы сверху */
    align-items: center; /* Центрируем по горизонтали */
    position: relative;
  }
  
  .header {
    display: flex;
    justify-content: center; /* Центрируем гифку по горизонтали */
    margin-top: 50px; /* Отступ сверху для картинки */
  }
  
  .header img {
    width: 150px;
    height: 150px;
  }
  
  .nft-collection {
    font-size: 20px;
    font-weight: bold;
    position: absolute;
    left: 20px; /* Размещаем текст слева */
    top: 50%; /* Центрируем текст по вертикали */
    transform: translateY(-50%); /* Подправляем точку для идеального центрирования */
    color: #3f3f46;
  }
  
  .wallet-address {
    font-size: 20px;
    font-weight: bold;
    position: absolute;
    left: 20px; /* Размещаем текст слева */
    top: 30%; /* Центрируем текст по вертикали */
    transform: translateY(-50%); /* Подправляем точку для идеального центрирования */
    color: #3f3f46;
  }
  </style>
  