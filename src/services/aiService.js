// Gemini AI Service for S-Net
// Includes: urgency analysis, content moderation, AI consultation, and summary generation
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI = null;
let model = null;

// Initialize Gemini AI
const initializeAI = () => {
    if (!API_KEY || API_KEY === 'your_gemini_api_key') {
        console.warn('Gemini API key not configured. Using mock responses.');
        return false;
    }

    try {
        genAI = new GoogleGenerativeAI(API_KEY);
        model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        return true;
    } catch (error) {
        console.error('Failed to initialize Gemini AI:', error);
        return false;
    }
};

// Check if AI is available
const isAIAvailable = () => {
    if (!model) {
        return initializeAI();
    }
    return !!model;
};

// ===== AI CONSULTATION MODE =====

// Foundation questions for AI to ask
export const FOUNDATION_QUESTIONS = [
    "Bạn đang gặp vấn đề gì vậy? Hãy kể cho mình nghe nhé 🌱",
    "Vấn đề này bắt đầu từ khi nào?",
    "Điều gì khiến bạn cảm thấy khó khăn nhất trong tình huống này?",
    "Theo thang điểm từ 1 đến 10, mức độ ảnh hưởng của vấn đề này đến cuộc sống của bạn là bao nhiêu?"
];

// Generate AI consultation response
export const generateConsultationResponse = async (message, conversationHistory = [], questionIndex = 0) => {
    if (!isAIAvailable()) {
        return mockConsultationResponse(questionIndex);
    }

    try {
        const historyContext = conversationHistory
            .slice(-5)
            .map(m => `${m.senderType === 'student' ? 'Học sinh' : 'AI'}: ${m.content}`)
            .join('\n');

        const prompt = `Bạn là trợ lý AI tâm lý thân thiện của S-Net. Học sinh đang trong phòng chat chờ giáo viên.

Lịch sử hội thoại:
${historyContext}

Tin nhắn mới của học sinh: "${message}"

Nhiệm vụ của bạn:
1. Thể hiện sự đồng cảm với học sinh
2. Tiếp tục đặt câu hỏi để hiểu rõ hơn vấn đề
3. Giữ giọng điệu ấm áp, không phán xét
4. Tin nhắn ngắn gọn (2-3 câu)

Nếu học sinh chia sẻ điều đau buồn, hãy an ủi trước khi hỏi tiếp.

Trả về JSON: {"response": "tin nhắn của bạn", "detectedIssue": "vấn đề chính nếu phát hiện hoặc null"}`;

        const result = await model.generateContent(prompt);
        const response = result.response.text();

        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        return mockConsultationResponse(questionIndex);
    } catch (error) {
        console.error('AI consultation error:', error);
        return mockConsultationResponse(questionIndex);
    }
};

// Generate supportive AI response while waiting for teacher (legacy support)
export const generateSupportiveResponse = async (message, conversationContext = []) => {
    if (!isAIAvailable()) {
        return mockSupportiveResponse(message);
    }

    try {
        const prompt = `Bạn là trợ lý tâm lý AI thân thiện. Học sinh đang chờ giáo viên phản hồi.

Tin nhắn học sinh: "${message}"

Hãy phản hồi:
1. Thể hiện sự đồng cảm
2. Cho họ biết bạn hiểu cảm xúc của họ
3. Động viên nhẹ nhàng
4. KHÔNG đưa ra lời khuyên cụ thể (để giáo viên làm)

Trả về JSON: {"response": "tin nhắn của bạn"}`;

        const result = await model.generateContent(prompt);
        const response = result.response.text();

        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return mockSupportiveResponse(message);
    } catch (error) {
        console.error('AI supportive response error:', error);
        return mockSupportiveResponse(message);
    }
};

const mockSupportiveResponse = (message) => {
    const responses = [
        "Mình hiểu bạn đang trải qua giai đoạn khó khăn. Giáo viên sẽ sớm phản hồi bạn nhé 💙",
        "Cảm ơn bạn đã chia sẻ. Bạn không đơn độc đâu. Thầy/cô sẽ hỗ trợ bạn ngay thôi 🌱",
        "Mình nghe bạn. Đôi khi chỉ cần được lắng nghe cũng giúp ích rất nhiều. Giáo viên đang đến đây 💚"
    ];
    return { response: responses[Math.floor(Math.random() * responses.length)] };
};

// Generate AI summary for teacher dashboard (hidden from student)
export const generateAISummary = async (conversationHistory) => {
    if (!isAIAvailable()) {
        return mockAISummary(conversationHistory);
    }

    try {
        const conversation = conversationHistory
            .filter(m => m.isVisible !== false)
            .map(m => `${m.senderType === 'student' ? 'Học sinh' : (m.senderType === 'ai' ? 'AI' : 'Hệ thống')}: ${m.content}`)
            .join('\n');

        const prompt = `Bạn là chuyên gia tâm lý phân tích hội thoại. Dựa trên cuộc trò chuyện sau, tạo bản tóm tắt cho giáo viên tư vấn.

CUỘC TRÒ CHUYỆN:
${conversation}

Trả về JSON với format chính xác:
{
    "mainIssue": "Mô tả ngắn gọn vấn đề chính (1-2 câu)",
    "category": "relationship|family|academic|mental_health|lifestyle|other",
    "severity": "low|medium|high|critical",
    "urgentSigns": ["dấu hiệu khẩn cấp nếu có, [] nếu không có"],
    "keyPoints": ["điểm quan trọng 1", "điểm quan trọng 2"],
    "suggestedApproach": "Gợi ý cách tiếp cận cho giáo viên"
}

Đánh giá severity:
- critical: có ý định tự hại, tự tử
- high: stress nặng, trầm cảm rõ ràng
- medium: vấn đề ảnh hưởng cuộc sống nhưng chưa nguy hiểm
- low: vấn đề nhẹ, cần lắng nghe

CHỈ trả về JSON, không có text khác.`;

        const result = await model.generateContent(prompt);
        const response = result.response.text();

        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        return mockAISummary(conversationHistory);
    } catch (error) {
        console.error('AI summary generation error:', error);
        return mockAISummary(conversationHistory);
    }
};

// ===== EXISTING FUNCTIONS (UPDATED) =====

// Analyze message urgency for mental health counseling
export const analyzeUrgency = async (message) => {
    if (!isAIAvailable()) {
        return mockAnalyzeUrgency(message);
    }

    try {
        const prompt = `Bạn là chuyên gia tâm lý học đường. Phân tích tin nhắn sau và đánh giá mức độ khẩn cấp.
    
Tin nhắn: "${message}"

Trả về JSON với format:
{
  "urgencyLevel": <số từ 1-10, 10 là khẩn cấp nhất>,
  "category": "<tình yêu|học tập|gia đình|tâm sinh lý|lối sống|khác>",
  "keywords": ["từ khóa 1", "từ khóa 2"],
  "riskFactors": ["yếu tố nguy cơ nếu có"],
  "suggestedResponse": "Gợi ý cách tiếp cận cho giáo viên",
  "needsImmediate": <true/false - cần can thiệp ngay>
}

CHỈ trả về JSON, không có text khác.`;

        const result = await model.generateContent(prompt);
        const response = result.response.text();

        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        return mockAnalyzeUrgency(message);
    } catch (error) {
        console.error('AI analysis error:', error);
        return mockAnalyzeUrgency(message);
    }
};

// Moderate confession content
export const moderateContent = async (content) => {
    if (!isAIAvailable()) {
        return mockModerateContent(content);
    }

    try {
        const prompt = `Bạn là hệ thống kiểm duyệt nội dung cho nền tảng tâm lý học đường. 
Kiểm tra nội dung confession sau:

"${content}"

Tiêu chí kiểm duyệt:
- Không chứa ngôn từ thù địch, bạo lực
- Không tiết lộ thông tin cá nhân người khác
- Không chứa nội dung 18+
- Không kích động tự hại
- Phù hợp môi trường giáo dục

Trả về JSON:
{
  "status": "<approved|review|rejected>",
  "confidence": <0-100>,
  "reason": "Lý do quyết định",
  "flaggedPhrases": ["cụm từ có vấn đề nếu có"],
  "suggestedCategory": "<tâm lý|ngoài lề>"
}

CHỈ trả về JSON, không có text khác.`;

        const result = await model.generateContent(prompt);
        const response = result.response.text();

        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        return mockModerateContent(content);
    } catch (error) {
        console.error('Content moderation error:', error);
        return mockModerateContent(content);
    }
};

// ===== MOCK FUNCTIONS =====

const mockConsultationResponse = (questionIndex) => {
    const responses = [
        { response: "Mình hiểu bạn đang gặp khó khăn. Bạn có thể kể thêm cho mình nghe không? Vấn đề này ảnh hưởng đến bạn như thế nào? 🌱", detectedIssue: null },
        { response: "Cảm ơn bạn đã chia sẻ. Vấn đề này bắt đầu từ khi nào vậy? Có điều gì đặc biệt xảy ra trước đó không?", detectedIssue: null },
        { response: "Mình thấy bạn đang chịu áp lực khá lớn. Điều gì khiến bạn cảm thấy khó khăn nhất trong tình huống này?", detectedIssue: "stress" },
        { response: "Bạn đã rất dũng cảm khi chia sẻ. Theo thang điểm 1-10, vấn đề này ảnh hưởng đến bạn ở mức nào?", detectedIssue: "emotional_difficulty" }
    ];

    return responses[Math.min(questionIndex, responses.length - 1)];
};

const mockAISummary = (conversationHistory) => {
    const studentMessages = conversationHistory.filter(m => m.senderType === 'student');
    const allText = studentMessages.map(m => m.content).join(' ').toLowerCase();

    // Detect category
    let category = 'other';
    let severity = 'medium';
    const urgentSigns = [];

    if (allText.includes('tự tử') || allText.includes('muốn chết') || allText.includes('không muốn sống')) {
        severity = 'critical';
        urgentSigns.push('Có ý định tự hại');
        category = 'mental_health';
    } else if (allText.includes('yêu') || allText.includes('crush') || allText.includes('người ấy')) {
        category = 'relationship';
    } else if (allText.includes('học') || allText.includes('thi') || allText.includes('điểm')) {
        category = 'academic';
    } else if (allText.includes('bố') || allText.includes('mẹ') || allText.includes('gia đình')) {
        category = 'family';
    } else if (allText.includes('buồn') || allText.includes('stress') || allText.includes('áp lực')) {
        category = 'mental_health';
        severity = 'high';
    }

    return {
        mainIssue: studentMessages.length > 0
            ? `Học sinh chia sẻ về vấn đề ${getCategoryName(category)}`
            : 'Chưa xác định được vấn đề cụ thể',
        category,
        severity,
        urgentSigns,
        keyPoints: studentMessages.slice(0, 3).map(m => m.content.substring(0, 50) + '...'),
        suggestedApproach: 'Lắng nghe, thể hiện sự đồng cảm và tìm hiểu thêm về hoàn cảnh'
    };
};

const getCategoryName = (category) => {
    const names = {
        relationship: 'tình cảm',
        family: 'gia đình',
        academic: 'học tập',
        mental_health: 'tâm lý',
        lifestyle: 'lối sống',
        other: 'cá nhân'
    };
    return names[category] || 'cá nhân';
};

const mockAnalyzeUrgency = (message) => {
    const lowercaseMsg = message.toLowerCase();

    const highUrgencyKeywords = ['tự tử', 'muốn chết', 'không muốn sống', 'tự hại', 'tự làm đau'];
    const mediumUrgencyKeywords = ['buồn', 'cô đơn', 'stress', 'áp lực', 'lo lắng', 'sợ'];

    let urgencyLevel = 3;
    let category = 'khác';
    let needsImmediate = false;

    if (highUrgencyKeywords.some(keyword => lowercaseMsg.includes(keyword))) {
        urgencyLevel = 9;
        category = 'tâm sinh lý';
        needsImmediate = true;
    } else if (mediumUrgencyKeywords.some(keyword => lowercaseMsg.includes(keyword))) {
        urgencyLevel = 6;
        category = 'tâm sinh lý';
    }

    if (lowercaseMsg.includes('yêu') || lowercaseMsg.includes('người ấy') || lowercaseMsg.includes('crush')) {
        category = 'tình yêu';
    } else if (lowercaseMsg.includes('học') || lowercaseMsg.includes('thi') || lowercaseMsg.includes('điểm')) {
        category = 'học tập';
    } else if (lowercaseMsg.includes('bố') || lowercaseMsg.includes('mẹ') || lowercaseMsg.includes('gia đình')) {
        category = 'gia đình';
    }

    return {
        urgencyLevel,
        category,
        keywords: [],
        riskFactors: needsImmediate ? ['Có dấu hiệu cần can thiệp'] : [],
        suggestedResponse: 'Lắng nghe và thể hiện sự đồng cảm',
        needsImmediate
    };
};

const mockModerateContent = (content) => {
    const lowercaseContent = content.toLowerCase();

    const violations = ['địt', 'đụ', 'fuck', 'shit'];
    const hasViolation = violations.some(v => lowercaseContent.includes(v));

    if (hasViolation) {
        return {
            status: 'rejected',
            confidence: 95,
            reason: 'Nội dung chứa ngôn từ không phù hợp',
            flaggedPhrases: [],
            suggestedCategory: 'tâm lý'
        };
    }

    return {
        status: 'approved',
        confidence: 85,
        reason: 'Nội dung phù hợp',
        flaggedPhrases: [],
        suggestedCategory: 'tâm lý'
    };
};

export default {
    FOUNDATION_QUESTIONS,
    generateConsultationResponse,
    generateAISummary,
    analyzeUrgency,
    moderateContent
};
