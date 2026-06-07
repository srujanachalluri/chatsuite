// English + Telugu strings for ChatSuite.
// Keys are grouped by feature; t('key') falls back to English then the key itself.
export const translations = {
  en: {
    // Login
    'login.tagline': 'Chat with friends · Create rooms · Talk to AI',
    'login.feature.realtime': '⚡ Real-time',
    'login.feature.ai': '🤖 AI Chat',
    'login.feature.reactions': '😊 Reactions',
    'login.continueGoogle': 'Continue with Google',
    'login.secure': 'Secure sign-in · No password needed',

    // Sidebar
    'sidebar.subtitle': 'Real-time · AI · Rooms',
    'sidebar.aiAssistant': 'AI Assistant',
    'sidebar.channels': 'Channels',
    'sidebar.direct': 'Direct',
    'sidebar.channelsHeading': 'Channels',
    'sidebar.dmHeading': 'Direct Messages',
    'sidebar.noChannels': 'No channels yet — create one!',
    'sidebar.noUsers': 'No other users yet',
    'sidebar.channelPlaceholder': 'channel-name',
    'sidebar.online': '● Online',
    'sidebar.signOut': 'Sign out of ChatSuite',

    // Welcome / empty
    'welcome.title': 'Welcome to ChatSuite',
    'welcome.subtitle': 'Pick a channel, send a direct message, or chat with AI',
    'welcome.channels': 'Channels',
    'welcome.channelsDesc': 'Group conversations',
    'welcome.dms': 'Direct Messages',
    'welcome.dmsDesc': 'Private chats',
    'welcome.ai': 'AI Chat',
    'welcome.aiDesc': 'Powered by Gemini',
    'app.loading': 'Loading ChatSuite...',

    // Chat
    'chat.groupChannel': 'Group channel',
    'chat.messages': 'messages',
    'chat.live': 'Live',
    'chat.members': 'Members',
    'chat.activeNow': '● Active now',
    'chat.roomWelcome': 'Welcome to',
    'chat.beFirst': 'Be the first to send a message!',
    'chat.startPrivate': 'Start your private conversation',

    // Input
    'input.placeholder': 'Write a message...',
    'input.messagePrefix': 'Message',
    'input.hint': 'Enter to send · Shift+Enter newline · **bold** *italic* ~~strike~~ `code`',
    'input.tooLong': 'Message too long (max {n} characters)',

    // Members
    'members.title': 'Members',
    'members.total': 'total',
    'members.online': 'online',
    'members.you': '(you)',
    'members.onlineStatus': '● Online',
    'members.offlineStatus': 'Offline',

    // AI
    'ai.title': 'AI Assistant',
    'ai.poweredBy': '● Powered by Gemini',
    'ai.clear': 'Clear',
    'ai.changeKey': 'Change Key',
    'ai.askAnything': 'Ask me anything!',
    'ai.placeholder': 'Ask AI anything...',
    'ai.enterKey': 'Enter your free Gemini API key to start chatting with AI.',
    'ai.getKey': 'Get one free here →',
    'ai.start': 'Start Chatting with AI →',
    'ai.invalidKey': 'Invalid key or quota exceeded. Try a new key from aistudio.google.com',

    // Toasts
    'toast.channelCreated': '#{name} created',
    'toast.channelFailed': 'Could not create channel',
    'toast.signedOut': 'Signed out',
    'toast.copied': 'Copied',
    'toast.copyFailed': 'Could not copy',
    'toast.msgUpdated': 'Message updated',
    'toast.msgUpdateFailed': 'Could not update message',
    'toast.msgDeleted': 'Message deleted',
    'toast.msgDeleteFailed': 'Could not delete message',
    'toast.sendFailed': 'Message failed to send',
    'toast.notificationsOn': 'Notifications enabled',

    // Menu
    'menu.copy': 'Copy',
    'menu.edit': 'Edit',
    'menu.delete': 'Delete',
    'edit.save': 'Save',
    'edit.cancel': 'Cancel',
    'msg.edited': 'edited',
  },

  te: {
    // Login
    'login.tagline': 'స్నేహితులతో చాట్ చేయండి · రూమ్‌లు సృష్టించండి · AIతో మాట్లాడండి',
    'login.feature.realtime': '⚡ నిజ-సమయం',
    'login.feature.ai': '🤖 AI చాట్',
    'login.feature.reactions': '😊 రియాక్షన్‌లు',
    'login.continueGoogle': 'Googleతో కొనసాగించండి',
    'login.secure': 'సురక్షిత సైన్-ఇన్ · పాస్‌వర్డ్ అవసరం లేదు',

    // Sidebar
    'sidebar.subtitle': 'నిజ-సమయం · AI · రూమ్‌లు',
    'sidebar.aiAssistant': 'AI సహాయకుడు',
    'sidebar.channels': 'ఛానెల్‌లు',
    'sidebar.direct': 'డైరెక్ట్',
    'sidebar.channelsHeading': 'ఛానెల్‌లు',
    'sidebar.dmHeading': 'డైరెక్ట్ సందేశాలు',
    'sidebar.noChannels': 'ఇంకా ఛానెల్‌లు లేవు — ఒకటి సృష్టించండి!',
    'sidebar.noUsers': 'ఇంకా ఇతర వినియోగదారులు లేరు',
    'sidebar.channelPlaceholder': 'ఛానెల్-పేరు',
    'sidebar.online': '● ఆన్‌లైన్',
    'sidebar.signOut': 'ChatSuite నుండి సైన్ అవుట్',

    // Welcome / empty
    'welcome.title': 'ChatSuiteకి స్వాగతం',
    'welcome.subtitle': 'ఒక ఛానెల్ ఎంచుకోండి, డైరెక్ట్ సందేశం పంపండి, లేదా AIతో చాట్ చేయండి',
    'welcome.channels': 'ఛానెల్‌లు',
    'welcome.channelsDesc': 'గ్రూప్ సంభాషణలు',
    'welcome.dms': 'డైరెక్ట్ సందేశాలు',
    'welcome.dmsDesc': 'ప్రైవేట్ చాట్‌లు',
    'welcome.ai': 'AI చాట్',
    'welcome.aiDesc': 'Gemini ఆధారితం',
    'app.loading': 'ChatSuite లోడ్ అవుతోంది...',

    // Chat
    'chat.groupChannel': 'గ్రూప్ ఛానెల్',
    'chat.messages': 'సందేశాలు',
    'chat.live': 'లైవ్',
    'chat.members': 'సభ్యులు',
    'chat.activeNow': '● ఇప్పుడు యాక్టివ్',
    'chat.roomWelcome': 'స్వాగతం',
    'chat.beFirst': 'మొదటి సందేశం పంపండి!',
    'chat.startPrivate': 'మీ ప్రైవేట్ సంభాషణ ప్రారంభించండి',

    // Input
    'input.placeholder': 'సందేశం రాయండి...',
    'input.messagePrefix': 'సందేశం',
    'input.hint': 'పంపడానికి Enter · కొత్త లైన్‌కి Shift+Enter · **బోల్డ్** *ఇటాలిక్* ~~స్ట్రైక్~~ `కోడ్`',
    'input.tooLong': 'సందేశం చాలా పొడవుగా ఉంది (గరిష్టం {n} అక్షరాలు)',

    // Members
    'members.title': 'సభ్యులు',
    'members.total': 'మొత్తం',
    'members.online': 'ఆన్‌లైన్',
    'members.you': '(మీరు)',
    'members.onlineStatus': '● ఆన్‌లైన్',
    'members.offlineStatus': 'ఆఫ్‌లైన్',

    // AI
    'ai.title': 'AI సహాయకుడు',
    'ai.poweredBy': '● Gemini ఆధారితం',
    'ai.clear': 'క్లియర్',
    'ai.changeKey': 'కీ మార్చండి',
    'ai.askAnything': 'నన్ను ఏదైనా అడగండి!',
    'ai.placeholder': 'AIని ఏదైనా అడగండి...',
    'ai.enterKey': 'AIతో చాట్ ప్రారంభించడానికి మీ ఉచిత Gemini API కీని నమోదు చేయండి.',
    'ai.getKey': 'ఇక్కడ ఉచితంగా పొందండి →',
    'ai.start': 'AIతో చాట్ ప్రారంభించండి →',
    'ai.invalidKey': 'చెల్లని కీ లేదా కోటా మించింది. aistudio.google.com నుండి కొత్త కీని ప్రయత్నించండి',

    // Toasts
    'toast.channelCreated': '#{name} సృష్టించబడింది',
    'toast.channelFailed': 'ఛానెల్ సృష్టించడం సాధ్యం కాలేదు',
    'toast.signedOut': 'సైన్ అవుట్ అయ్యారు',
    'toast.copied': 'కాపీ చేయబడింది',
    'toast.copyFailed': 'కాపీ చేయడం సాధ్యం కాలేదు',
    'toast.msgUpdated': 'సందేశం నవీకరించబడింది',
    'toast.msgUpdateFailed': 'సందేశం నవీకరించడం సాధ్యం కాలేదు',
    'toast.msgDeleted': 'సందేశం తొలగించబడింది',
    'toast.msgDeleteFailed': 'సందేశం తొలగించడం సాధ్యం కాలేదు',
    'toast.sendFailed': 'సందేశం పంపడం విఫలమైంది',
    'toast.notificationsOn': 'నోటిఫికేషన్‌లు ప్రారంభించబడ్డాయి',

    // Menu
    'menu.copy': 'కాపీ',
    'menu.edit': 'సవరించు',
    'menu.delete': 'తొలగించు',
    'edit.save': 'సేవ్',
    'edit.cancel': 'రద్దు',
    'msg.edited': 'సవరించబడింది',
  },
};
