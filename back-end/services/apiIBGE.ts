import axios from "axios";

export async function getEstados() {
    try {
      const response = await axios.get("https://servicodados.ibge.gov.br/api/v1/localidades/estados");
      return response.data.map((estado: any) => ({
        id: estado.id, 
        nome: estado.nome,
        sigla: estado.sigla,
      }));
    } catch (error) {
      console.error("Erro ao obter estados:", error);
      throw new Error("Erro ao obter estados");
    }
  }
  
  export async function getCidadesPorEstado(sigla: string) {
    try {
      const response = await axios.get(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${sigla}/municipios`
      );
      return response.data.map((cidade: any) => ({
        id: cidade.id, 
        nome: cidade.nome,
      }));
    } catch (error) {
      console.error(`Erro ao obter cidades do estado ${sigla}:`, error);
      throw new Error(`Erro ao obter cidades do estado ${sigla}`);
    }
  }
  