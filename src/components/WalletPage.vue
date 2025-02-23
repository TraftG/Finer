<template>
  <div class="wallet-container">
    <BackButton @click="handleBackButton" />
    <div class="header">
      <img src="../assets/utyaduck_agadaweaaladvqo.gif" alt="Wallet Animation" />
    </div>
    <div class="content-box">
      <div class="wallet-address">Wallet</div>
      <img src="../assets/wallet.png" alt="" class="walletimg">
      <div class="ton-connect-wrapper">
        <TonConnectButton class="custom-ton-button" v-if="!rawAddress" />
        <span class="raw-address" v-if="rawAddress">{{ userFriendlyAddress }}</span>
      </div>

      <div class="button-container" v-if="rawAddress">
        <button class="claimnft" @click="redirectToClaimPage">
          <span class="textnft">Claim NFT</span>
        </button>

        <button class="disconnect" @click="disconnectWallet">
          <span class="distext">Disconnect</span>
        </button>
      </div>
    </div>

    <!-- Новый контейнер для NFT коллекции -->
    <div class="nft-collection-container" v-if="nfts.length">
      <h2 class="nft-collection-title">NFT Collection</h2>
      <div class="nft-collection">
        <div v-for="nft in nfts" :key="nft.index" class="nft-item">
          <img :src="nft.metadata.image" alt="NFT Image" class="nft-image" />
          <p v-if="nft.metadata.description" class="nft-description">{{ nft.metadata.description }}</p>
          <p v-if="nft.metadata && nft.metadata.attributes && nft.metadata.attributes.length">Attributes:</p>
          <ul v-if="nft.metadata && nft.metadata.attributes">
            <li v-for="(attribute, idx) in nft.metadata.attributes" :key="idx">
              {{ attribute.trait_type }}: {{ attribute.value }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <p v-else>No NFTs or not connected wallet</p>
  </div>
</template>
<script>
import { ref, watch } from 'vue';
import { TonConnectButton, useTonAddress, useTonConnectUI } from '@townsquarelabs/ui-vue';
import axios from 'axios';
import { BackButton } from 'vue-tg';

export default {
  name: "WalletPage",

  setup() {
    const userFriendlyAddress = useTonAddress();
    const rawAddress = useTonAddress();
    const addressCollection = 'EQAjhJJhtyIDrRwDcA7Ocjbm7-Q-HcaiW8eLFdLYH7uXHRbP';  // Collection address
    const { tonConnectUI } = useTonConnectUI();
    const nfts = ref([]);

    const axiosInstance = axios.create({
      baseURL: 'https://tonapi.io/v2',
    });

    // Handle back button click
    function handleBackButton() {
      window.history.back();
    }

    // Fetch NFTs for the connected wallet
    const checkNftsOnAccount = async () => {
      if (!rawAddress) return;

      const address = rawAddress._value || rawAddress;  // Ensure rawAddress is a string

      if (typeof address !== 'string') {
        console.error('Invalid wallet address:', address);
        return;
      }

      console.log("Fetching NFTs for wallet address:", address);  // Log the address

      try {
        const { data } = await axiosInstance.get(`/accounts/${address}/nfts?collection=${addressCollection}`);
        nfts.value = data.nft_items || [];
      } catch (error) {
        console.error("Error fetching NFTs:", error);
        nfts.value = [];
      }
    };

    // Watch for changes to rawAddress
    watch(rawAddress, (newAddress) => {
      console.log("rawAddress changed:", newAddress); // Log the new address when it changes
      if (newAddress) {
        checkNftsOnAccount();
      } else {
        nfts.value = [];
      }
    });

    // Disconnect wallet
    const disconnectWallet = async () => {
      try {
        if (tonConnectUI && tonConnectUI.disconnect) {
          await tonConnectUI.disconnect();
          console.log("Wallet disconnected successfully");
        } else {
          console.error("tonConnectUI or disconnect is undefined.");
        }
      } catch (error) {
        console.error("Failed to disconnect wallet:", error);
      }
    };

    function redirectToClaimPage() {
      window.location.href = "https://finerminter.netlify.app/";
    }

    return {
      userFriendlyAddress,
      rawAddress,
      nfts,
      disconnectWallet,
      handleBackButton,
      redirectToClaimPage,
    };
  },

  components: {
    TonConnectButton,
    BackButton,
  },
};
</script>

<style scoped>
.wallet-container {
  text-align: center;
  padding: 20px;
  background-color: #2B2B2B;
  height: 100vh;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.header {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.header img {
  width: 150px;
  height: 150px;
}

.content-box {
  margin-top: 20px;
  background-color: #ffffff14;
  border-radius: 10px;
  padding: 20px;
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.wallet-address {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #ffffff;
}

.walletimg {
  width: 13px;
  height: 13px;
  margin-right: 90px;
  margin-top: -30px;
}

.ton-connect-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 30px 0;
}

.button-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.claimnft,
.disconnect,
.get-nft {
  border: none;
  border-radius: 40px;
  width: 130px;
  height: 30px;
  background-color: #0084ff;
}

.textnft,
.distext {
  color: #ffffff;
  font-size: 14px;
  font-weight: bold;
}

.raw-address {
  margin-top: -10px;
  font-size: 13px;
  color: #727272;
  font-weight: bold;
}

.nft-list {
  margin-top: 20px;
  color: white;
  text-align: left;
}

.nft-list ul {
  list-style-type: none;
  padding: 0;
}

.nft-list li {
  margin: 5px 0;
}

.back {
  border: none;
  background-color: rgba(255, 255, 255, 0);
}

.back-image {
  margin-right: 250px;
  width: 30px;
  height: 30px;
  filter: invert(100%) brightness(100%) contrast(100%);
}

.nft-collection-container {
  margin-top: 30px;
  padding: 20px;
  background-color: #ffffff14;
  border-radius: 10px;
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.nft-collection-title {
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 15px;
}

.nft-collection {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.nft-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
  padding: 10px;
  width: 150px;
}

.nft-image {
  border-radius: 8px;
  width: 100px;
  height: 100px;
  object-fit: cover;
}

.nft-description {
  margin-top: 10px;
  font-size: 14px;
  color: #ddd;
  text-align: center;
}
</style>
