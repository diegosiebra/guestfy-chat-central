
// Serviço para gerenciar propriedades no Stay.net
import { Property } from "@/types/propertyTypes";

// Mock de dados de propriedades baseado no exemplo fornecido
const generateMockProperties = (): Property[] => {
  return [
    {
      "_id": "659ea9f5e15de33422a445b8",
      "id": "DB09I",
      "_idproperty": "6685ac8beb32f8f2f06c32b5",
      "_t_propertyTypeMeta": {
        "_mstitle": {
          "pt_BR": "Prédio",
          "en_US": "Building",
          "es_ES": "Edifício",
          "pt_PT": "Prédio"
        }
      },
      "_idtype": "5ab8f8a2f6b2dc2e97f9704a",
      "_t_typeMeta": {
        "_mstitle": {
          "pt_BR": "Suíte",
          "en_US": "Suite",
          "de_DE": "Suite",
          "es_ES": "Suite",
          "ru_RU": "Люкс",
          "pt_PT": "Suíte"
        }
      },
      "subtype": "entire_home",
      "internalName": "Benx 2074/10 ( APOLO )",
      "_mstitle": {
        "pt_BR": "Santo Amaro ao lado da Estação João Dias - APOLO"
      },
      "_msdesc": {
        "pt_BR": "<br>Lindo Apartamento em Santo Amaro , A 700M da Estação João Dias e 4 estações do Autódromo Interlagos, fácil acesso ao Tokyo Marine Hall (500m) , Espaço Blue Tree 600m , Vibra (1,0KM), Expo Transamérica (1,2km), Centro comercial da Nestlé (500M) , Parque Burle Max (1,5KM) e Severo Gomes (2,0KM) e as Avenidas Luis Carlos Berrine , Chucri Zaidan , aos Shoppings Morumbi, Parque da Cidade. Pão de Açucar minuto, assim como bares e restaurantes, tudo pertinho. Vc vai se encantar."
      },
      "_mshouserules": {
        "pt_BR": "É OBRIGATÓRIO o envio de foto da documentação de todos os hóspedes, para registro e maior segurança ao acesso, agradecemos sua compreensão"
      },
      "_mssummary": {
        "pt_BR": "<br>Lindo Apartamento em Santo Amaro , A 700M da Estação João Dias e 4 estações do Autódromo Interlagos, fácil acesso ao Tokyo Marine Hall (500m) , Espaço Blue Tree 600m , Vibra (1,0KM), Expo Transamérica (1,2km), Centro comercial da Nestlé (500M) , Parque Burle Max (1,5KM) e Severo Gomes (2,0KM) e as Avenidas Luis Carlos Berrine , Chucri Zaidan , aos Shoppings Morumbi, Parque da Cidade. Pão de Açucar minuto, assim como bares e restaurantes, tudo pertinho. Vc vai se encantar."
      },
      "status": "active",
      "_i_maxGuests": 4,
      "_i_rooms": 2,
      "_i_beds": 3,
      "_f_bathrooms": 1,
      "address": {
        "countryCode": "BR",
        "state": "São Paulo",
        "stateCode": "SP",
        "city": "São Paulo",
        "region": "Santo Amaro",
        "street": "Avenida João Dias",
        "streetNumber": "2074",
        "additional": "10",
        "zip": "04724003"
      },
      "latLng": {
        "_f_lat": -23.6446398,
        "_f_lng": -46.7203807
      },
      "amenities": [
        { "_id": "667085c7289db083b0c3167d" },
        { "_id": "5dd3f06b18f1235ba2e4562a" },
        { "_id": "667085c7289db083b0c31686" }
      ],
      "deff_curr": "BRL",
      "_f_square": 35,
      "_idmainImage": "67db6f8b0384d2658f5502df",
      "_t_mainImageMeta": {
        "url": "https://aaol.stays.net/image/67db6f8b0384d2658f5502df"
      },
      "images": [
        { "_id": "659eaa1de15de33422a45b8d" }
      ],
      "_t_imagesMeta": [
        {
          "_id": "67db6f8b0384d2658f5502df",
          "url": "https://aaol.stays.net/image/67db6f8b0384d2658f5502df",
          "_msname": {
            "pt_BR": "Sala de Estar",
            "en_US": "Living Room",
            "es_ES": "Sala de Estar",
            "pt_PT": "Sala de Estar"
          },
          "area": "main"
        },
        {
          "_id": "67db6fde6e79ad395ce91099",
          "url": "https://aaol.stays.net/image/67db6fde6e79ad395ce91099",
          "_msname": {
            "pt_BR": "Cama",
            "en_US": "Bed",
            "es_ES": "Cama",
            "pt_PT": "Cama"
          },
          "area": "room"
        },
        {
          "_id": "67db6fde53eb9b1f9c9ad4b5",
          "url": "https://aaol.stays.net/image/67db6fde53eb9b1f9c9ad4b5",
          "_msname": {
            "pt_BR": "Quarto",
            "en_US": "Bedroom",
            "es_ES": "Dormitorio",
            "pt_PT": "Quarto"
          },
          "area": "room"
        }
      ],
      "instantBooking": true,
      "owner": {
        "name": "Antonio Augusto Oliveira",
        "phones": [
          { "iso": "+5511914181070" }
        ]
      },
      "groupIds": [
        "669e2e62b30fc7a46c244adc"
      ]
    }
  ];
};

// API mock methods
export const fetchProperties = async (): Promise<Property[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockProperties());
    }, 500);
  });
};

export const fetchPropertyById = async (id: string): Promise<Property | null> => {
  const properties = await fetchProperties();
  return properties.find(property => property.id === id) || null;
};
