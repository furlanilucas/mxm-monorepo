import { OpenAI } from 'openai';
import { AppError } from '../utils/AppError';

interface ProductSuggestion {
  description: string;
  category: string;
}

class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async generateProductDetails(productName: string): Promise<ProductSuggestion> {
    try {
      const prompt = `Gere uma descrição atraente e uma categoria apropriada para o seguinte produto: "${productName}".
      Responda APENAS no formato JSON abaixo, sem explicações adicionais:
      {
        "description": "descrição detalhada do produto em português, com 2-3 frases",
        "category": "categoria mais apropriada em português"
      }`;

      const completion = await this.openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
        temperature: 0.7,
        max_tokens: 200,
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Não foi possível gerar os detalhes do produto');
      }

      try {
        const result = JSON.parse(content);
        return {
          description: result.description,
          category: result.category
        };
      } catch (error) {
        console.error('Erro ao fazer parse da resposta:', content);
        throw new Error('Formato de resposta inválido');
      }
    } catch (error) {
      console.error('Erro ao gerar detalhes do produto:', error);
      throw new AppError('Erro ao gerar detalhes do produto. Por favor, tente novamente.');
    }
  }
}

export default new OpenAIService(); 