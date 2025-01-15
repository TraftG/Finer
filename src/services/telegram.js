export function useTelegram() {
    const tg = typeof window !== 'undefined' && window.Telegram ? window.Telegram.WebApp : null;

    return {
        tg,
        user: tg?.initDataUnsafe?.user,
        
    };
}
