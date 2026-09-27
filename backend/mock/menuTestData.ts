export const menuTestCases: Record<string, any> = {
  happyPath: {
    menus: [
      {
        id: "menu_main",
        title: { translations: { zh_tw: "主菜單", en_us: "Main Menu" } },
        service_availability: [
          {
            day_of_week: "monday",
            time_periods: [{ start_time: "11:00", end_time: "22:00" }],
          },
        ],
        category_ids: ["cat_bento"],
      },
    ],
    categories: [
      {
        id: "cat_bento",
        title: {
          translations: { zh_tw: "經典便當", en_us: "Classic Bento" },
        },
        entities: [{ type: "ITEM", id: "item_pork_chop" }],
      },
    ],
    items: [
      {
        id: "item_pork_chop",
        title: {
          translations: { zh_tw: "排骨飯", en_us: "Pork Chop Rice" },
        },
        description: {
          translations: {
            zh_tw: "台式經典炸排骨",
            en_us: "Classic fried pork chop",
          },
        },
        price_info: { price: 12000 },
        tax_info: { tax_rate: 5 },
      },
    ],
    modifier_groups: [],
    display_options: {},
  },
  emptyMenu: {
    items: [],
    modifier_groups: [],
    categories: [],
    menus: [
      {
        id: "empty_menu_id",
        title: { translations: { en_us: "Empty Menu" } },
        service_availability: [
          {
            day_of_week: "monday",
            time_periods: [{ start_time: "00:00", end_time: "23:59" }],
          },
        ],
        category_ids: [],
      },
    ],
    display_options: {},
  },
  missingOptionals: {
    menus: [
      {
        id: "menu_basic",
        title: { translations: { en_us: "Drinks" } },
        category_ids: ["cat_drinks"],
        service_availability: [],
      },
    ],
    categories: [
      {
        id: "cat_drinks",
        title: { translations: { en_us: "Drinks" } },
        entities: [{ type: "ITEM", id: "item_water" }],
      },
    ],
    items: [
      {
        id: "item_water",
        title: { translations: { en_us: "Water" } },
        price_info: { price: 0 },
      },
    ],
    modifier_groups: [],
  },
  suspended: {
    items: [
      {
        id: "item_limited",
        title: { translations: { en_us: "Limited Truffle Fries" } },
        price_info: { price: 8000 },
        suspension_info: {
          suspension_reasons: ["OUT_OF_STOCK"],
          suspended_until: 1735689600,
        },
      },
    ],
    categories: [],
    menus: [],
  },
  complexModifier: {
    items: [
      {
        id: "item_burger",
        title: { translations: { en_us: "Custom Burger" } },
        price_info: { price: 15000 },
        modifier_group_ids: { ids: ["mod_add_ons"] },
      },
    ],
    modifier_groups: [
      {
        id: "mod_add_ons",
        title: { translations: { en_us: "Choose Add-ons" } },
        quantity_info: {
          quantity: { min_permitted: 1, max_permitted: 3 },
        },
        modifier_options: [
          { type: "ITEM", id: "item_bacon" },
          { type: "ITEM", id: "item_cheese" },
        ],
      },
    ],
  },
  dietary: {
    items: [
      {
        id: "item_salad",
        title: { translations: { en_us: "Garden Salad" } },
        price_info: { price: 9000 },
        dish_info: {
          classifications: {
            dietary_label_info: {
              labels: ["VEGETARIAN", "VEGAN", "GLUTEN_FREE"],
            },
          },
        },
      },
    ],
    categories: [],
    menus: [],
  },
  priceOverrides: {
    items: [
      {
        id: "item_coke",
        title: { translations: { zh_tw: "可樂", en_us: "Coke" } },
        price_info: {
          price: 3000,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "lunch_combo",
              price: 0,
            },
          ],
        },
      },
    ],
    categories: [],
    menus: [],
  },
  sellingInfo: {
    items: [
      {
        id: "item_steak",
        title: { translations: { en_us: "Ribeye Steak" } },
        price_info: {
          price: 5000,
          priced_by_unit: { measurement_type: "MEASUREMENT_TYPE_WEIGHT" },
        },
        selling_info: [
          {
            sold_by_unit: {
              measurement_type: "MEASUREMENT_TYPE_WEIGHT",
              weight_unit: "WEIGHT_UNIT_TYPE_METRIC_GRAM",
            },
            quantity_constraints: {
              min_permitted: 100,
              max_permitted: 500,
              increment: 100,
            },
          },
        ],
      },
    ],
    categories: [],
    menus: [],
  },
  orphanEntity: {
    categories: [
      {
        id: "cat_specials",
        title: { translations: { en_us: "Specials" } },
        entities: [
          { type: "ITEM", id: "item_valid" },
          { type: "ITEM", id: "item_ghost" },
        ],
      },
    ],
    items: [
      {
        id: "item_valid",
        title: { translations: { en_us: "Valid Item" } },
        price_info: { price: 1000 },
      },
    ],
    menus: [],
    modifier_groups: [],
  },
  apiError: {
    error: {
      code: "unauthorized",
      message: "OAuth 2.0 Bearer token missing or invalid scope.",
      details: [
        {
          field: "authorization",
          description: "eats.store scope is required to access this endpoint.",
        },
      ],
    },
  },
  customerRealData: {
    menus: [
      {
        id: "全日菜單",
        title: {
          translations: {
            en: "全日菜單",
          },
        },
        service_availability: [
          {
            day_of_week: "monday",
            time_periods: [
              {
                start_time: "11:00",
                end_time: "13:30",
              },
              {
                start_time: "17:00",
                end_time: "19:30",
              },
            ],
          },
          {
            day_of_week: "tuesday",
            time_periods: [
              {
                start_time: "11:00",
                end_time: "13:30",
              },
              {
                start_time: "17:00",
                end_time: "19:30",
              },
            ],
          },
          {
            day_of_week: "wednesday",
            time_periods: [
              {
                start_time: "11:00",
                end_time: "13:30",
              },
              {
                start_time: "17:00",
                end_time: "19:30",
              },
            ],
          },
          {
            day_of_week: "thursday",
            time_periods: [
              {
                start_time: "11:00",
                end_time: "13:30",
              },
              {
                start_time: "17:00",
                end_time: "19:30",
              },
            ],
          },
          {
            day_of_week: "friday",
            time_periods: [
              {
                start_time: "11:00",
                end_time: "13:30",
              },
              {
                start_time: "17:00",
                end_time: "19:30",
              },
            ],
          },
          {
            day_of_week: "saturday",
            time_periods: [
              {
                start_time: "11:00",
                end_time: "13:30",
              },
              {
                start_time: "17:00",
                end_time: "19:30",
              },
            ],
          },
        ],
        category_ids: [
          "人氣精選",
          "農夫精選系列餐",
          "健康舒肥餐",
          "健康養生素食餐",
          "農夫小資族系列(五樣配菜)",
          "單點區",
          "養生飲品",
        ],
      },
    ],
    categories: [
      {
        id: "健康舒肥餐",
        title: {
          translations: {
            en: "健康舒肥餐(九樣配菜)",
          },
        },
        entities: [
          {
            id: "檸檬迷迭香舒肥雞",
            type: "ITEM",
          },
          {
            id: "新疆孜然舒肥雞",
            type: "ITEM",
          },
          {
            id: "日式味增舒肥雞",
            type: "ITEM",
          },
        ],
      },
      {
        id: "健康養生素食餐",
        title: {
          translations: {
            en: "健康養生素食餐(九樣配菜)",
          },
        },
        entities: [
          {
            id: "素食養生餐",
            type: "ITEM",
          },
          {
            id: "元氣蔬果沙拉_29416",
          },
        ],
      },
      {
        id: "養生飲品",
        title: {
          translations: {
            en: "養生飲品",
          },
        },
        entities: [
          {
            id: "高山冷泡茶飲",
            type: "ITEM",
          },
          {
            id: "錫蘭紅茶",
            type: "ITEM",
          },
          {
            id: "非基改豆漿（微糖）",
          },
          {
            id: "燕麥薏仁（微糖）",
          },
          {
            id: "氣泡水",
            type: "ITEM",
          },
        ],
      },
      {
        id: "農夫小資族系列(五樣配菜)",
        title: {
          translations: {
            en: "農夫小資族系列(五樣配菜)",
          },
        },
        entities: [
          {
            id: "(小資)農夫養的雞",
          },
          {
            id: "(小資)農夫養的豬",
          },
          {
            id: "(小資)農夫養的鴨",
          },
          {
            id: "(小資)哞哞滷牛仔",
          },
          {
            id: "(小資)香煎鮭魚排",
          },
          {
            id: "(小資)薄鹽鯖魚燒",
          },
          {
            id: "(小資)檸檬迷迭香舒肥雞",
          },
          {
            id: "(小資)新疆孜然舒肥雞",
          },
          {
            id: "(小資)日式味增舒肥雞",
          },
        ],
      },
      {
        id: "單點區",
        title: {
          translations: {
            en: "單點區",
          },
        },
        entities: [
          {
            id: "單點滷牛肉",
            type: "ITEM",
          },
          {
            id: "單點櫻桃鴨",
          },
          {
            id: "單點香草雞腿",
            type: "ITEM",
          },
          {
            id: "單點蔗香豬",
            type: "ITEM",
          },
          {
            id: "單點香煎鮭魚",
            type: "ITEM",
          },
          {
            id: "單點薄鹽鯖魚",
            type: "ITEM",
          },
          {
            id: "單點舒肥雞系列",
            type: "ITEM",
          },
          {
            id: "新疆孜然舒肥雞胸肉_35103",
          },
          {
            id: "日式味增舒肥雞胸肉",
          },
          {
            id: "單點紅藜飯",
            type: "ITEM",
          },
        ],
      },
      {
        id: "人氣精選",
        title: {
          translations: {
            en: "人氣精選",
          },
        },
        entities: [
          {
            id: "農夫養的雞",
          },
          {
            id: "農夫養的鴨",
          },
          {
            id: "香煎鮭魚排",
          },
          {
            id: "農村裡的豬",
          },
        ],
      },
      {
        id: "農夫精選系列餐",
        title: {
          translations: {
            en: "農夫精選豪華系列餐(九樣配菜)",
          },
        },
        entities: [
          {
            id: "哞哞滷牛仔",
            type: "ITEM",
          },
          {
            id: "薄鹽鯖魚燒",
            type: "ITEM",
          },
        ],
      },
    ],
    items: [
      {
        id: "單點香煎鮭魚",
        external_data: "ZB025",
        title: {
          translations: {
            en: "單點香煎鮭魚",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 7500,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "主食加購區",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED", "CAT_PREPARED_FOOD"],
            source: "DEFAULT",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "新疆孜然舒肥雞胸肉_35103",
        external_data: "ZB028",
        title: {
          translations: {
            en: "單點新疆孜然舒肥雞胸肉",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        price_info: {
          price: 6000,
          overrides: [],
        },
        quantity_info: {
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "主食加購區",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        suspension_info: {
          suspension: {
            suspend_until: 8640000000,
          },
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED"],
            source: "MANUAL",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "(小資)薄鹽鯖魚燒",
        external_data: "ZB017",
        title: {
          translations: {
            en: "(小資)薄鹽鯖魚燒",
          },
        },
        description: {
          translations: {
            en: "小資族首選系列,五樣配菜,菜色依當天食材為主.",
          },
        },
        price_info: {
          price: 15500,
          overrides: [],
        },
        suspension_info: {
          suspension: {
            suspend_until: 8640000000,
          },
          overrides: [],
        },
        modifier_group_ids: {
          ids: ["特製莎莎醬", "主食加購區", "加飯區"],
          overrides: [],
        },
        tax_info: {
          vat_rate_percentage: 5,
        },
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED"],
            source: "MANUAL",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "(小資)日式味增舒肥雞",
        external_data: "ZB020",
        title: {
          translations: {
            en: "(小資)日式味增舒肥雞",
          },
        },
        description: {
          translations: {
            en: "小資族首選系列,五樣配菜,菜色依當天食材為主.",
          },
        },
        price_info: {
          price: 13500,
          overrides: [],
        },
        suspension_info: {
          overrides: [],
        },
        modifier_group_ids: {
          ids: ["特製莎莎醬", "主食加購區", "加飯區"],
          overrides: [],
        },
        tax_info: {
          vat_rate_percentage: 5,
        },
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED"],
            source: "MANUAL",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "(小資)農夫養的鴨",
        external_data: "ZB014",
        title: {
          translations: {
            en: "(小資)農夫養的鴨",
          },
        },
        description: {
          translations: {
            en: "小資族首選系列,五樣配菜,菜色依當天食材為主.",
          },
        },
        price_info: {
          price: 16500,
          overrides: [],
        },
        suspension_info: {
          suspension: {
            suspend_until: 8640000000,
          },
          overrides: [],
        },
        modifier_group_ids: {
          ids: ["特製莎莎醬", "主食加購區", "加飯區"],
          overrides: [],
        },
        tax_info: {
          vat_rate_percentage: 5,
        },
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED"],
            source: "MANUAL",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "氣泡水",
        external_data: "ZB035",
        title: {
          translations: {
            en: "氣泡水",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 6000,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        suspension_info: {
          suspension: {
            suspend_until: 8640000000,
          },
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["CAT_PREPARED_FOOD", "TEMP_COLD"],
            source: "MANUAL",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "(小資)香煎鮭魚排",
        external_data: "ZB016",
        title: {
          translations: {
            en: "(小資)香煎鮭魚排",
          },
        },
        description: {
          translations: {
            en: "小資族首選系列,五樣配菜,菜色依當天食材為主.",
          },
        },
        price_info: {
          price: 15500,
          overrides: [],
        },
        suspension_info: {
          overrides: [],
        },
        modifier_group_ids: {
          ids: ["特製莎莎醬", "主食加購區", "加飯區"],
          overrides: [],
        },
        tax_info: {
          vat_rate_percentage: 5,
        },
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED"],
            source: "MANUAL",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "農夫養的雞",
        external_data: "ZB001",
        title: {
          translations: {
            en: "農夫養的雞",
          },
        },
        description: {
          translations: {
            en: "嚴選台灣雞肉/附贈莎莎醬\n金黃酥脆的外皮, 鮮嫩的雞腿肉,\n讓你們補充滿滿蛋白質\n\n圖片僅供參考以實際餐盒為主\n(餐盒均附黎麥飯. 配菜. 雞蛋)\n配菜會依照當令季節時蔬略有不同而更換, 皆以現場製作食材為主!",
          },
        },
        image_url:
          "https://d1ralsognjng37.cloudfront.net/8b5baa77-af26-4d31-ba20-7e5ca111ad7d.jpeg",
        price_info: {
          price: 18500,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        suspension_info: {
          overrides: [],
        },
        modifier_group_ids: {
          ids: ["特製莎莎醬", "主食加購區", "加飯區"],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["CAT_PREPARED_FOOD", "TEMP_HEATED"],
            source: "MANUAL",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "(小資)農夫養的豬",
        external_data: "ZB013",
        title: {
          translations: {
            en: "(小資)農夫養的豬",
          },
        },
        description: {
          translations: {
            en: "小資族首選系列,五樣配菜,菜色依當天食材為主.",
          },
        },
        price_info: {
          price: 15500,
          overrides: [],
        },
        suspension_info: {
          overrides: [],
        },
        modifier_group_ids: {
          ids: ["特製莎莎醬", "主食加購區", "加飯區"],
          overrides: [],
        },
        tax_info: {
          vat_rate_percentage: 5,
        },
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED"],
            source: "MANUAL",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "單點舒肥雞系列",
        external_data: "ZB027",
        title: {
          translations: {
            en: "單點檸檬迷迭香舒肥雞胸肉",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 6000,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "主食加購區",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED", "CAT_PREPARED_FOOD"],
            source: "DEFAULT",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "農夫養的鴨",
        external_data: "ZB003",
        title: {
          translations: {
            en: "農夫養的鴨",
          },
        },
        description: {
          translations: {
            en: "嚴選台灣鴨胸/附贈莎莎醬\n本草綱目紀載鴨肉溫順. 養胃, 又能清熱消腫,\n我們選用帶有櫻桃木香的煙燻鴨胸, \n讓您口齒留香, 又能補充滿滿蛋白質\n\n圖片僅供參考以實際餐盒為主\n(餐盒均附黎麥飯. 配菜.雞蛋)\n配菜會依照當令季節時蔬略有不同而更換, 皆以現場製作食材為主!",
          },
        },
        image_url:
          "https://d1ralsognjng37.cloudfront.net/a756a2f1-87c4-47db-b4c6-375d9806517f.jpeg",
        price_info: {
          price: 18500,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        suspension_info: {
          suspension: {
            suspend_until: 8640000000,
          },
          overrides: [],
        },
        modifier_group_ids: {
          ids: ["特製莎莎醬", "主食加購區", "加飯區"],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["CAT_PREPARED_FOOD", "TEMP_HEATED"],
            source: "MANUAL",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "單點薄鹽鯖魚",
        external_data: "ZB026",
        title: {
          translations: {
            en: "單點薄鹽鯖魚",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 6000,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "主食加購區",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        suspension_info: {
          suspension: {
            suspend_until: 8640000000,
          },
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED", "CAT_PREPARED_FOOD"],
            source: "DEFAULT",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "農村裡的豬",
        external_data: "ZB002",
        title: {
          translations: {
            en: "農村裡的豬",
          },
        },
        description: {
          translations: {
            en: "嚴選台灣豬肉/附贈莎莎醬\n甘甜美味的紅甘蔗為燻料加上 Q 彈鮮嫩的豬肉\n讓人口齒留香的好味道~\n\n圖片僅供參考以實際餐盒為主\n(餐盒均附黎麥飯. 配菜.雞蛋)\n配菜會依照當令季節時蔬略有不同而更換, 皆以現場製作食材為主!",
          },
        },
        image_url:
          "https://d1ralsognjng37.cloudfront.net/735cc2c2-e28c-4ab7-bd11-dff01f6b938b.jpeg",
        price_info: {
          price: 17500,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        suspension_info: {
          overrides: [],
        },
        modifier_group_ids: {
          ids: ["特製莎莎醬", "主食加購區", "加飯區"],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["CAT_PREPARED_FOOD", "TEMP_HEATED"],
            source: "MANUAL",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "(小資)檸檬迷迭香舒肥雞",
        external_data: "ZB018",
        title: {
          translations: {
            en: "(小資)檸檬迷迭香舒肥雞",
          },
        },
        description: {
          translations: {
            en: "小資族首選系列,五樣配菜,菜色依當天食材為主.",
          },
        },
        price_info: {
          price: 13500,
          overrides: [],
        },
        modifier_group_ids: {
          ids: ["特製莎莎醬"],
          overrides: [],
        },
        tax_info: {
          vat_rate_percentage: 5,
        },
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED"],
            source: "MANUAL",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "非基改豆漿（微糖）",
        external_data: "ZB033",
        title: {
          translations: {
            en: "非基改豆漿（微糖）",
          },
        },
        description: {
          translations: {
            en: "非基改黃豆製品。（330ml)",
          },
        },
        price_info: {
          price: 3500,
          overrides: [],
        },
        tax_info: {
          vat_rate_percentage: 5,
        },
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            dietary_label_info: {
              labels: [],
            },
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["CAT_PREPARED_FOOD", "TEMP_COLD"],
            source: "MANUAL",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "(小資)新疆孜然舒肥雞",
        external_data: "ZB019",
        title: {
          translations: {
            en: "(小資)新疆孜然舒肥雞",
          },
        },
        description: {
          translations: {
            en: "小資族首選系列,五樣配菜,菜色依當天食材為主.",
          },
        },
        price_info: {
          price: 13500,
          overrides: [],
        },
        suspension_info: {
          suspension: {
            suspend_until: 8640000000,
          },
          overrides: [],
        },
        modifier_group_ids: {
          ids: ["特製莎莎醬", "主食加購區", "加飯區"],
          overrides: [],
        },
        tax_info: {
          vat_rate_percentage: 5,
        },
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED"],
            source: "MANUAL",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "元氣蔬果沙拉_29416",
        external_data: "ZB011",
        title: {
          translations: {
            en: "元氣蔬果沙拉",
          },
        },
        description: {
          translations: {
            en: "圖片僅供參考以實際餐盒為主,\n餐盒均附 【和風柚子醬】 \n\n配菜會依照當令季節時蔬略有不同而更換, \n皆以現場製作食材為主!",
          },
        },
        price_info: {
          price: 11800,
          overrides: [],
        },
        suspension_info: {
          suspension: {
            suspend_until: 8640000000,
          },
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_COLD"],
            source: "MANUAL",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "單點蔗香豬",
        external_data: "ZB023",
        title: {
          translations: {
            en: "單點蔗香豬",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 6000,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "主食加購區",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        suspension_info: {
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED", "CAT_PREPARED_FOOD"],
            source: "DEFAULT",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "新疆孜然舒肥雞",
        external_data: "ZB008",
        title: {
          translations: {
            en: "新疆孜然舒肥雞",
          },
        },
        description: {
          translations: {
            en: "嚴選台灣雞胸肉\n是健身達人與愛美女性的寵兒首選系列\n能夠讓人增肌減脂又能補充滿滿的蛋白質\n\n圖片僅供參考以實際餐盒為主\n(餐盒均附黎麥飯. 配菜. 雞蛋)\n配菜會依照當令季節時蔬略有不同而更換, 皆以現場製作食材為主!",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/01a0df90edad7ccbe791a3292a47f827/4218ca1d09174218364162cd0b1a8cc1.jpeg",
        price_info: {
          price: 15500,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        suspension_info: {
          suspension: {
            suspend_until: 8640000000,
          },
          overrides: [],
        },
        modifier_group_ids: {
          ids: ["特製莎莎醬", "主食加購區", "加飯區"],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["CAT_PREPARED_FOOD", "TEMP_HEATED"],
            source: "MANUAL",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "(小資)哞哞滷牛仔",
        external_data: "ZB015",
        title: {
          translations: {
            en: "(小資)哞哞滷牛仔",
          },
        },
        description: {
          translations: {
            en: "小資族首選系列,五樣配菜,菜色依當天食材為主.",
          },
        },
        price_info: {
          price: 16500,
          overrides: [],
        },
        suspension_info: {
          suspension: {
            suspend_until: 8640000000,
          },
          overrides: [],
        },
        modifier_group_ids: {
          ids: ["特製莎莎醬", "主食加購區", "加飯區"],
          overrides: [],
        },
        tax_info: {
          vat_rate_percentage: 5,
        },
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED"],
            source: "MANUAL",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "檸檬迷迭香舒肥雞",
        external_data: "ZB007",
        title: {
          translations: {
            en: "檸檬迷迭香舒肥雞",
          },
        },
        description: {
          translations: {
            en: "嚴選台灣雞胸肉\n是健身達人與愛美女性的寵兒首選系列\n能夠讓人增肌減脂又能補充滿滿的蛋白質\n\n圖片僅供參考以實際餐盒為主\n(餐盒均附黎麥飯. 配菜. 雞蛋)\n配菜會依照當令季節時蔬略有不同而更換, 皆以現場製作食材為主!",
          },
        },
        image_url: "",
        price_info: {
          price: 15500,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        modifier_group_ids: {
          ids: ["特製莎莎醬"],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["CAT_PREPARED_FOOD", "TEMP_HEATED"],
            source: "MANUAL",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "高山冷泡茶飲",
        external_data: "ZB032",
        title: {
          translations: {
            en: "農夫泡茶趣(烏龍)",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 3500,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        suspension_info: {
          suspension: {
            suspend_until: 8640000000,
          },
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["CAT_PREPARED_FOOD", "TEMP_COLD"],
            source: "MANUAL",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "哞哞滷牛仔",
        external_data: "ZB004",
        title: {
          translations: {
            en: "哞哞滷牛仔(滷牛腱)",
          },
        },
        description: {
          translations: {
            en: "嚴選美國牛肉/附贈莎莎醬\n採用獨家秘方滷製而成, 香氣十足帶點微辣感\n又能補充滿滿蛋白質, 是愛吃牛的顧客首選\n\n圖片僅供參考以實際餐盒為主\n(餐盒均附黎麥飯. 配菜. 雞蛋)\n配菜會依照當令季節時蔬略有不同而更換, 皆以現場製作食材為主!",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/eats-approver/7683d5fb-32a0-47b9-8b01-57e80633821b.jpeg",
        price_info: {
          price: 18500,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        suspension_info: {
          suspension: {
            suspend_until: 8640000000,
          },
          overrides: [],
        },
        modifier_group_ids: {
          ids: ["特製莎莎醬", "主食加購區", "加飯區"],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["CAT_PREPARED_FOOD", "TEMP_HEATED"],
            source: "MANUAL",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "單點紅藜飯",
        external_data: "ZB030",
        title: {
          translations: {
            en: "單點紅藜飯",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 2500,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "加飯區",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        suspension_info: {
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED", "CAT_PREPARED_FOOD"],
            source: "DEFAULT",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "額外加價購莎莎醬",
        title: {
          translations: {
            en: "額外加價購莎莎醬",
          },
        },
        description: {
          translations: {
            en: "內含 : 洋蔥.蒜頭.彩椒.辣椒等食材調味而成。",
          },
        },
        price_info: {
          price: 1300,
          overrides: [],
        },
        quantity_info: {
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "特製莎莎醬",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        tax_info: {
          vat_rate_percentage: 5,
        },
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_COLD"],
            source: "MANUAL",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "錫蘭紅茶",
        external_data: "ZB031",
        title: {
          translations: {
            en: "農夫泡茶趣(青茶)",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 3500,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        suspension_info: {
          suspension: {
            suspend_until: 1666022399,
          },
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["CAT_PREPARED_FOOD", "TEMP_COLD"],
            source: "MANUAL",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "香煎鮭魚排",
        external_data: "ZB005",
        title: {
          translations: {
            en: "香煎鮭魚排",
          },
        },
        description: {
          translations: {
            en: "採用 挪威鮭魚排/附贈莎莎醬\n\n圖片僅供參考以實際餐盒為主\n(餐盒均附黎麥飯. 配菜.雞蛋)\n配菜會依照當令季節時蔬略有不同而更換, 皆以現場製作食材為主!",
          },
        },
        image_url:
          "https://d1ralsognjng37.cloudfront.net/1eb156bc-8a9f-4cd9-9fa9-af44d3e08931.jpeg",
        price_info: {
          price: 17500,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        suspension_info: {
          overrides: [],
        },
        modifier_group_ids: {
          ids: ["特製莎莎醬", "主食加購區", "加飯區"],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["CAT_PREPARED_FOOD", "TEMP_HEATED"],
            source: "MANUAL",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "日式味增舒肥雞胸肉",
        external_data: "ZB029",
        title: {
          translations: {
            en: "單點日式味增舒肥雞胸肉",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        price_info: {
          price: 6000,
          overrides: [],
        },
        quantity_info: {
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "主食加購區",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED", "CAT_PREPARED_FOOD"],
            source: "DEFAULT",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "不需提供莎莎醬",
        title: {
          translations: {
            en: "不需提供莎莎醬",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        price_info: {
          price: 0,
          overrides: [],
        },
        quantity_info: {
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "特製莎莎醬",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        tax_info: {
          vat_rate_percentage: 5,
        },
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_COLD"],
            source: "MANUAL",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "提供莎莎醬",
        title: {
          translations: {
            en: "需要莎莎醬",
          },
        },
        description: {
          translations: {
            en: "內含 : 洋蔥.蒜頭.彩椒.辣椒等食材調味而成。",
          },
        },
        price_info: {
          price: 0,
          overrides: [],
        },
        quantity_info: {
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "特製莎莎醬",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        tax_info: {
          vat_rate_percentage: 5,
        },
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_COLD"],
            source: "MANUAL",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "(小資)農夫養的雞",
        external_data: "ZB012",
        title: {
          translations: {
            en: "(小資)農夫養的雞",
          },
        },
        description: {
          translations: {
            en: "小資族首選系列,五樣配菜,菜色依當天食材為主.",
          },
        },
        price_info: {
          price: 16500,
          overrides: [],
        },
        suspension_info: {
          overrides: [],
        },
        modifier_group_ids: {
          ids: ["特製莎莎醬", "主食加購區", "加飯區"],
          overrides: [],
        },
        tax_info: {
          vat_rate_percentage: 5,
        },
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED"],
            source: "MANUAL",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "單點滷牛肉",
        external_data: "ZB024",
        title: {
          translations: {
            en: "單點滷牛腱",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 7500,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "主食加購區",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        suspension_info: {
          suspension: {
            suspend_until: 8640000000,
          },
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED", "CAT_PREPARED_FOOD"],
            source: "DEFAULT",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "單點櫻桃鴨",
        external_data: "ZB022",
        title: {
          translations: {
            en: "單點櫻桃鴨胸",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        price_info: {
          price: 7500,
          overrides: [],
        },
        quantity_info: {
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "主食加購區",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        suspension_info: {
          suspension: {
            suspend_until: 8640000000,
          },
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED", "CAT_PREPARED_FOOD"],
            source: "DEFAULT",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "素食養生餐",
        external_data: "ZB010",
        title: {
          translations: {
            en: "素食養生餐",
          },
        },
        description: {
          translations: {
            en: "餐點均附贈特製莎莎醬，內含洋蔥蒜頭，如有吃全素之顧客請注意並告知！\n\n圖片僅供參考以實際餐盒為主\n( 餐盒均附 蔬菜飯\n含彩椒類 . 配菜. 蛋 )\n配菜會依照當令季節時蔬略有不同而更換, \n皆以現場製作食材為主!",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/efbbd726f916a27d13f43775e238dbb5/4218ca1d09174218364162cd0b1a8cc1.jpeg",
        price_info: {
          price: 11800,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        suspension_info: {
          suspension: {
            suspend_until: 1667059199,
          },
          overrides: [],
        },
        modifier_group_ids: {
          ids: ["特製莎莎醬", "主食加購區", "加飯區"],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            dietary_label_info: {
              labels: ["VEGETARIAN"],
            },
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["CAT_PREPARED_FOOD", "TEMP_HEATED"],
            source: "MANUAL",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "燕麥薏仁（微糖）",
        external_data: "ZB034",
        title: {
          translations: {
            en: "燕麥薏仁（微糖）",
          },
        },
        description: {
          translations: {
            en: "燕麥、薏仁製品。（330ml)",
          },
        },
        price_info: {
          price: 3500,
          overrides: [],
        },
        tax_info: {
          vat_rate_percentage: 5,
        },
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            dietary_label_info: {
              labels: ["VEGAN", "VEGETARIAN"],
            },
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["CAT_PREPARED_FOOD", "TEMP_COLD"],
            source: "MANUAL",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "單點香草雞腿",
        external_data: "ZB021",
        title: {
          translations: {
            en: "單點香草雞腿",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 7500,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "主食加購區",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        suspension_info: {
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED", "CAT_PREPARED_FOOD"],
            source: "DEFAULT",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "薄鹽鯖魚燒",
        external_data: "ZB006",
        title: {
          translations: {
            en: "薄鹽鯖魚燒",
          },
        },
        description: {
          translations: {
            en: "採用 挪威鯖魚排/附贈莎莎醬\n\n圖片僅供參考以實際餐盒為主\n(餐盒均附黎麥飯. 配菜. 雞蛋)\n配菜會依照當令季節時蔬略有不同而更換, 皆以現場製作食材為主!",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/7ea2553a9fb34492dc7c6453f2ccea95/4218ca1d09174218364162cd0b1a8cc1.jpeg",
        price_info: {
          price: 17500,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        suspension_info: {
          suspension: {
            suspend_until: 8640000000,
          },
          overrides: [],
        },
        modifier_group_ids: {
          ids: ["特製莎莎醬", "主食加購區", "加飯區"],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["CAT_PREPARED_FOOD", "TEMP_HEATED"],
            source: "MANUAL",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "日式味增舒肥雞",
        external_data: "ZB009",
        title: {
          translations: {
            en: "日式味增舒肥雞",
          },
        },
        description: {
          translations: {
            en: "嚴選台灣雞胸肉\n是健身達人與愛美女性的寵兒首選系列\n能夠讓人增肌減脂又能補充滿滿的蛋白質\n\n圖片僅供參考、香料僅供點綴效果 以實際餐盒為主\n(餐盒均附黎麥飯. 配菜.雞蛋)\n配菜會依照當令季節時蔬略有不同而更換, 皆以現場製作食材為主!",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/ccaf935efd914c18a2a772e139fd655c/4218ca1d09174218364162cd0b1a8cc1.jpeg",
        price_info: {
          price: 15500,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        suspension_info: {
          overrides: [],
        },
        modifier_group_ids: {
          ids: ["特製莎莎醬", "主食加購區", "加飯區"],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["CAT_PREPARED_FOOD", "TEMP_HEATED"],
            source: "MANUAL",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
    ],
    modifier_groups: [
      {
        id: "主食加購區",
        external_data: "",
        title: {
          translations: {
            en: "主食加購區",
          },
        },
        quantity_info: {
          quantity: {
            max_permitted: 2,
          },
          overrides: [],
        },
        modifier_options: [
          {
            id: "日式味增舒肥雞胸肉",
            type: "ITEM",
          },
          {
            id: "單點香草雞腿",
            type: "ITEM",
          },
          {
            id: "單點香煎鮭魚",
            type: "ITEM",
          },
          {
            id: "新疆孜然舒肥雞胸肉_35103",
            type: "ITEM",
          },
          {
            id: "單點滷牛肉",
            type: "ITEM",
          },
          {
            id: "單點蔗香豬",
            type: "ITEM",
          },
          {
            id: "單點薄鹽鯖魚",
            type: "ITEM",
          },
          {
            id: "單點舒肥雞系列",
            type: "ITEM",
          },
          {
            id: "單點櫻桃鴨",
            type: "ITEM",
          },
        ],
      },
      {
        id: "加飯區",
        external_data: "",
        title: {
          translations: {
            en: "加飯區",
          },
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [],
        },
        modifier_options: [
          {
            id: "單點紅藜飯",
            type: "ITEM",
          },
        ],
      },
      {
        id: "特製莎莎醬",
        external_data: "",
        title: {
          translations: {
            en: "特製莎莎醬(葷)",
          },
        },
        quantity_info: {
          quantity: {
            min_permitted: 1,
            max_permitted: 2,
          },
          overrides: [],
        },
        modifier_options: [
          {
            id: "提供莎莎醬",
            type: "ITEM",
          },
          {
            id: "不需提供莎莎醬",
            type: "ITEM",
          },
          {
            id: "額外加價購莎莎醬",
            type: "ITEM",
          },
        ],
      },
    ],
  },
  retailAndCompliance: {
    items: [
      {
        id: "item_energy_drink",
        external_data: "POS_SKU_98765", // POS 系統對接 ID
        title: { translations: { en_us: "Energy Drink", zh_tw: "能量飲料" } },
        image_url: "https://example.com/images/energy-drink.jpg",
        price_info: { price: 6000 },
        product_info: {
          // 零售業必備的條碼資訊
          gtin: "1234567890123",
        },
        nutritional_info: {
          allergens: ["CAFFEINE"],
        },
        beverage_info: {
          caffeine_amount: {
            interval: { lower: 150000 }, // 150mg (以 E5 格式表示)
            volume: { unit_type: "VOLUME_UNIT_TYPE_METRIC_MILLILITER" },
          },
        },
        visibility_info: {
          // 控制商品層級的顯示時段
          visibility_hours: [
            {
              day_of_week: "monday",
              time_periods: [{ start_time: "06:00", end_time: "12:00" }],
            },
          ],
        },
      },
    ],
    categories: [],
    menus: [],
  },
  advancedPricingAndBundles: {
    items: [
      {
        id: "item_burger_combo",
        title: { translations: { en_us: "Burger Combo" } },
        price_info: {
          price: 15000, // 實際售價 150
          core_price: 15000,
          in_store_price: 13000, // 店內價 130
          container_deposit: 500, // 容器押金 5
        },
        bundled_items: [
          // 固定的附餐（供退款時參考，前端不可客製化）
          { id: "item_default_fries" },
          { id: "item_default_cola" },
        ],
        tax_info: {
          tax_rate: 5,
        },
        tax_label_info: {
          labels: ["STANDARD_TAX"],
        },
      },
    ],
    categories: [],
    menus: [],
  },
  coco: {
    menus: [
      {
        id: "全日菜單_Menu",
        title: {
          translations: {
            en: "全日菜單 Menu",
          },
        },
        service_availability: [
          {
            day_of_week: "monday",
            time_periods: [
              {
                start_time: "11:00",
                end_time: "21:00",
              },
            ],
          },
          {
            day_of_week: "tuesday",
            time_periods: [
              {
                start_time: "11:00",
                end_time: "21:00",
              },
            ],
          },
          {
            day_of_week: "wednesday",
            time_periods: [
              {
                start_time: "11:00",
                end_time: "21:00",
              },
            ],
          },
          {
            day_of_week: "thursday",
            time_periods: [
              {
                start_time: "11:00",
                end_time: "21:00",
              },
            ],
          },
          {
            day_of_week: "friday",
            time_periods: [
              {
                start_time: "11:00",
                end_time: "21:00",
              },
            ],
          },
          {
            day_of_week: "saturday",
            time_periods: [
              {
                start_time: "11:00",
                end_time: "21:00",
              },
            ],
          },
          {
            day_of_week: "sunday",
            time_periods: [
              {
                start_time: "11:00",
                end_time: "21:00",
              },
            ],
          },
        ],
        category_ids: [
          "注意事項_Notice",
          "人氣精選_Popular_Items",
          "歐姆蛋類_Omelet_Rice",
          "肉類咖哩_Meat_Curry",
          "海鮮咖哩_Seafood_Curry",
          "蔬菜咖哩_Vegetable_Curry",
          "特別咖哩_Special_Curry",
          "組合咖哩_Mixed_Curry",
          "素食咖哩_Vegetarian_Curr",
          "咖哩拉麵_Ramen_with_Curr",
          "咖哩烏龍麵_Udon_with_Curr",
          "個人調理包_Frozen_Sauce",
          "客服專用,_請勿下單_Order_Not",
        ],
      },
    ],
    categories: [
      {
        id: "客服專用,_請勿下單_Order_Not",
        title: {
          translations: {
            en: "客服專用, 請勿下單 Order Notice",
          },
        },
        entities: [
          {
            id: "U_炸豬排歐姆蛋咖哩飯_U_Omelet",
            type: "ITEM",
          },
          {
            id: "U_炸雞塊歐姆蛋咖哩飯_U_Omelet",
            type: "ITEM",
          },
        ],
      },
      {
        id: "肉類咖哩_Meat_Curry",
        title: {
          translations: {
            en: "肉類咖哩 Meat Curry",
          },
        },
        entities: [
          {
            id: "炸豬排咖哩飯_Pork_Cutlet_C_79587",
            type: "ITEM",
          },
          {
            id: "炸雞塊咖哩飯_Fried_Chicken",
            type: "ITEM",
          },
          {
            id: "涮豬肉咖哩飯_Pork_SHABU_Cu",
            type: "ITEM",
          },
          {
            id: "燉雞肉咖哩飯_Stewed_Chicke",
            type: "ITEM",
          },
          {
            id: "香脆雞腿排咖哩飯_Lightly_Cri",
            type: "ITEM",
          },
        ],
      },
      {
        id: "注意事項_Notice",
        title: {
          translations: {
            en: "注意事項 Notice",
          },
        },
        entities: [
          {
            id: "因應政府規定不得免費提供一次性餐具之政策",
            type: "ITEM",
          },
        ],
      },
      {
        id: "蔬菜咖哩_Vegetable_Curry",
        title: {
          translations: {
            en: "蔬菜咖哩 Vegetable Curry",
          },
        },
        entities: [
          {
            id: "菠菜咖哩飯_Spinach_Curry",
            type: "ITEM",
          },
          {
            id: "綜合菇咖哩飯_Assorted_Mush_83605",
            type: "ITEM",
          },
          {
            id: "茄子咖哩飯_Eggplant_Curry",
            type: "ITEM",
          },
          {
            id: "秋葵豆腐咖哩飯_Okra_Tofu_Cu",
            type: "ITEM",
          },
        ],
      },
      {
        id: "特別咖哩_Special_Curry",
        title: {
          translations: {
            en: "特別咖哩 Special Curry",
          },
        },
        entities: [
          {
            id: "日式牛肉燴飯_Hashed_Beef_R",
            type: "ITEM",
          },
          {
            id: "起士咖哩飯_Cheese_Curry",
            type: "ITEM",
          },
          {
            id: "炸雞塊‧蔬菜湯咖哩_(附_150_克飯)",
            type: "ITEM",
          },
        ],
      },
      {
        id: "人氣精選_Popular_Items",
        title: {
          translations: {
            en: "人氣精選 Popular Items",
          },
        },
        entities: [
          {
            id: "炸豬排歐姆蛋咖哩飯_Omelet_Ric_76973",
            type: "ITEM",
          },
          {
            id: "炸雞塊歐姆蛋咖哩飯_Omelet_Cur",
            type: "ITEM",
          },
          {
            id: "炸雞塊咖哩飯_Fried_Chicken_67770",
            type: "ITEM",
          },
          {
            id: "綜合菇咖哩飯_Assorted_Mush",
            type: "ITEM",
          },
          {
            id: "炸豬排咖哩飯_Pork_Cutlet_C",
            type: "ITEM",
          },
        ],
      },
      {
        id: "海鮮咖哩_Seafood_Curry",
        title: {
          translations: {
            en: "海鮮咖哩 Seafood Curry",
          },
        },
        entities: [
          {
            id: "炸蝦咖哩飯_Fried_Shrimp_C",
            type: "ITEM",
          },
          {
            id: "海鮮咖哩飯_Seafood_Curry",
            type: "ITEM",
          },
          {
            id: "蝦仁咖哩飯_Stewed_Shrimp_",
            type: "ITEM",
          },
        ],
      },
      {
        id: "個人調理包_Frozen_Sauce",
        title: {
          translations: {
            en: "個人調理包 Frozen Sauce",
          },
        },
        entities: [
          {
            id: "冷凍不辣咖哩醬_Frozen_Non-S",
            type: "ITEM",
          },
          {
            id: "冷凍素食咖哩醬_Frozen_Vegan",
            type: "ITEM",
          },
          {
            id: "冷凍辣味咖哩醬_Frozen_Spicy",
            type: "ITEM",
          },
        ],
      },
      {
        id: "素食咖哩_Vegetarian_Curr",
        title: {
          translations: {
            en: "素食咖哩 Vegetarian Curry",
          },
        },
        entities: [
          {
            id: "素食起士綜合菇咖哩飯_Assorted_",
            type: "ITEM",
          },
          {
            id: "素食麻婆咖哩飯_MABO_Vegetar",
            type: "ITEM",
          },
          {
            id: "素食舒植肉丸咖哩飯_Plant-base",
            type: "ITEM",
          },
        ],
      },
      {
        id: "組合咖哩_Mixed_Curry",
        title: {
          translations: {
            en: "組合咖哩 Mixed Curry",
          },
        },
        entities: [
          {
            id: "歐姆蛋炸雞塊番茄青花椰菜咖哩飯_Omel",
            type: "ITEM",
          },
          {
            id: "麻婆蝦仁咖哩飯_MABO_Curry_w",
            type: "ITEM",
          },
          {
            id: "炸雞排起士咖哩飯_Chicken_Cut",
            type: "ITEM",
          },
          {
            id: "炸雞塊菠菜咖哩飯_Fried_Chick",
            type: "ITEM",
          },
          {
            id: "炸豬排蔬菜歐姆蛋咖哩飯_Omelet_R",
            type: "ITEM",
          },
          {
            id: "(H)_茄子_(H)_炸雞塊及蕃茄青花椰",
            type: "ITEM",
          },
        ],
      },
      {
        id: "咖哩烏龍麵_Udon_with_Curr",
        title: {
          translations: {
            en: "咖哩烏龍麵 Udon with Curry",
          },
        },
        entities: [
          {
            id: "炸豬排咖哩烏龍麵_Curry_Udon_",
            type: "ITEM",
          },
          {
            id: "菠菜咖哩烏龍麵_Curry_Udon_w",
            type: "ITEM",
          },
          {
            id: "綜合菇咖哩烏龍麵_Curry_Udon_",
            type: "ITEM",
          },
          {
            id: "炸蝦咖哩烏龍麵_Curry_Udon_w",
            type: "ITEM",
          },
          {
            id: "燉雞肉咖哩烏龍麵_Curry_Udon_",
            type: "ITEM",
          },
        ],
      },
      {
        id: "咖哩拉麵_Ramen_with_Curr",
        title: {
          translations: {
            en: "咖哩拉麵 Ramen with Curry",
          },
        },
        entities: [
          {
            id: "咖哩拉麵_Ramen_with_Curr_45600",
            type: "ITEM",
          },
          {
            id: "涮牛肉咖哩拉麵_Ramen_with_B",
            type: "ITEM",
          },
          {
            id: "炸雞塊咖哩拉麵_Ramen_with_D",
            type: "ITEM",
          },
          {
            id: "炸豬排咖哩拉麵_Ramen_with_D",
            type: "ITEM",
          },
          {
            id: "香脆雞腿排咖哩拉麵_Lightly_Cr",
            type: "ITEM",
          },
        ],
      },
      {
        id: "歐姆蛋類_Omelet_Rice",
        title: {
          translations: {
            en: "歐姆蛋類 Omelet Rice",
          },
        },
        entities: [
          {
            id: "歐姆蛋炸蝦咖哩飯_Omelet_Rice",
            type: "ITEM",
          },
          {
            id: "歐姆蛋奶油雞肉咖哩飯_Omelet_Ri",
            type: "ITEM",
          },
          {
            id: "歐姆蛋日式牛肉燴飯_Omelet_Ric",
            type: "ITEM",
          },
          {
            id: "炸豬排歐姆蛋咖哩飯_Omelet_Ric",
            type: "ITEM",
          },
          {
            id: "炸雞塊歐姆蛋咖哩飯_Omelet_Cur",
            type: "ITEM",
          },
          {
            id: "歐姆蛋麻婆咖哩飯_Omelet_Rice",
            type: "ITEM",
          },
        ],
      },
    ],
    items: [
      {
        id: "水煮蛋_(蛋素可選)_Hard_Boil",
        external_data: "XF23",
        title: {
          translations: {
            en: "水煮蛋 (蛋素可選) Hard Boiled Egg (Ovo Vegetarian)",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 2000,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              price: 2000,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "涮豬肉咖哩飯_Pork_SHABU_Cu",
        external_data: "XA005",
        title: {
          translations: {
            en: "涮豬肉咖哩飯 Pork SHABU Curry",
          },
        },
        description: {
          translations: {
            en: "含主餐及附餐。豬肉來源: 巴拉圭。圖片僅供參考, 餐點以實物為準。",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/2693a25b83fdf17ede900f227775845a/a1681d67ebe55c76c3af5f401619c278.jpeg",
        price_info: {
          price: 32700,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        modifier_group_ids: {
          ids: [
            "飯量選擇_Choose_Rice",
            "辣度_Spicy_Level",
            "附餐選擇_Choose_Side_Dis",
            "咖哩醬加點_Curry_Sauce_Ad_88123",
            "咖哩飯加點_Add_On",
          ],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["CAT_PREPARED_FOOD", "TEMP_HEATED"],
            source: "MANUAL",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "涮牛肉_(牛肉來源:美國)_Beef_S",
        external_data: "XF04",
        title: {
          translations: {
            en: "涮牛肉 (牛肉來源:美國) Beef SHABU (Beef Source: American))",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 8500,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              price: 8500,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED", "CAT_PREPARED_FOOD"],
            source: "DEFAULT",
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "400_克_400_g",
        external_data: "XC02",
        title: {
          translations: {
            en: "400 克 400 g",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 4000,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飯量選擇_Choose_Rice",
              price: 4000,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飯量選擇_Choose_Rice",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飯量選擇_Choose_Rice",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "青花椰菜_Broccoli",
        external_data: "XF30",
        title: {
          translations: {
            en: "青花椰菜 Broccoli",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 4000,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              price: 4000,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              price: 4000,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              quantity: {
                max_permitted: 1,
              },
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              quantity: {},
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              ids: null,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED", "CAT_PREPARED_FOOD"],
            source: "DEFAULT",
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "炸蝦咖哩烏龍麵_Curry_Udon_w",
        external_data: "XA254",
        title: {
          translations: {
            en: "炸蝦咖哩烏龍麵 Curry Udon with Fried Shrimp",
          },
        },
        description: {
          translations: {
            en: "含主餐及附餐。圖片僅供參考, 餐點以實物為準。",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/e56bdb697060242c7e23f16100971ee6/a1681d67ebe55c76c3af5f401619c278.jpeg",
        price_info: {
          price: 44200,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        suspension_info: {
          overrides: [],
        },
        modifier_group_ids: {
          ids: ["附餐選擇_Choose_Side_Dis", "咖哩飯加點_Add_On"],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "玉米_Corn_82690",
        external_data: "XF16",
        title: {
          translations: {
            en: "玉米 Corn",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 2000,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              price: 2000,
            },
          ],
        },
        quantity_info: {
          quantity: {},
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              quantity: {},
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "日式牛肉燴飯_Hashed_Beef_R",
        external_data: "XA014",
        title: {
          translations: {
            en: "日式牛肉燴飯 Hashed Beef",
          },
        },
        description: {
          translations: {
            en: "含主餐及附餐。牛肉來源: 美國。圖片僅供參考, 餐點以實物為準。",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/89f8414f8ab8a63d1efcb8a89b7dfa20/a1681d67ebe55c76c3af5f401619c278.jpeg",
        price_info: {
          price: 42600,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        modifier_group_ids: {
          ids: [
            "飯量選擇_Choose_Rice",
            "附餐選擇_Choose_Side_Dis",
            "咖哩飯加點_Add_On",
          ],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED", "CAT_PREPARED_FOOD"],
            source: "DEFAULT",
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "冰雪碧_Iced_Sprite",
        external_data: "XA11",
        title: {
          translations: {
            en: "冰雪碧 Iced Sprite",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 0,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飲品選擇_Choose_Beverage",
              price: 0,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飲品選擇_Choose_Beverage",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飲品選擇_Choose_Beverage",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED", "CAT_PREPARED_FOOD"],
            source: "DEFAULT",
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "蝦仁_Shirmp",
        external_data: "XF12",
        title: {
          translations: {
            en: "蝦仁 Shirmp",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 12500,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              price: 12500,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED", "CAT_PREPARED_FOOD"],
            source: "DEFAULT",
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "素食起士綜合菇咖哩飯_Assorted_",
        external_data: "XA105",
        title: {
          translations: {
            en: "素食起士綜合菇咖哩飯 Assorted Mushroom Vegetarian Curry with Cheese",
          },
        },
        description: {
          translations: {
            en: "含主餐及附餐。圖片僅供參考, 餐點以實物為準。",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/7515060ad403ff75afde76718ea37f45/a1681d67ebe55c76c3af5f401619c278.jpeg",
        price_info: {
          price: 40400,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        modifier_group_ids: {
          ids: [
            "飯量選擇_Choose_Rice",
            "素食辣度選擇_Vegetarian_Sp",
            "附餐選項_Choose_Side_Dis",
            "素食咖哩醬加購_Vegetarian_C",
            "素食配菜加購_Vegetarian_Ad",
          ],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "5_辛_(超辣)_Crazy_Spicy",
        external_data: "XD07",
        title: {
          translations: {
            en: "5 辛 (超辣) Crazy Spicy",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 0,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "辣度_Spicy_Level",
              price: 0,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食辣度選擇_Vegetarian_Sp_59537",
              price: 0,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "麻婆辣度選擇_Mabo_Spicy_Le",
              price: 0,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食辣度選擇_Vegetarian_Sp",
              price: 0,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "辣度_Spicy_Level",
              quantity: {},
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食辣度選擇_Vegetarian_Sp_59537",
              quantity: {
                max_permitted: 1,
              },
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "麻婆辣度選擇_Mabo_Spicy_Le",
              quantity: {
                max_permitted: 1,
              },
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食辣度選擇_Vegetarian_Sp",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "辣度_Spicy_Level",
              ids: null,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食辣度選擇_Vegetarian_Sp_59537",
              ids: null,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "麻婆辣度選擇_Mabo_Spicy_Le",
              ids: null,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食辣度選擇_Vegetarian_Sp",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED", "CAT_PREPARED_FOOD"],
            source: "DEFAULT",
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "炸豬排歐姆蛋咖哩飯_Omelet_Ric_76973",
        external_data: "XA002",
        title: {
          translations: {
            en: "炸豬排歐姆蛋咖哩飯 Omelet Rice Curry with Pork Cutlet",
          },
        },
        description: {
          translations: {
            en: "固定飯量 200 克。含主餐及附餐。豬肉來源: 加拿大或台灣。圖片僅供參考, 餐點以實物為準。",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/b18d3751a75bac3b012b7734cbd7865e/a1681d67ebe55c76c3af5f401619c278.jpeg",
        price_info: {
          price: 43100,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        modifier_group_ids: {
          ids: [
            "辣度_Spicy_Level",
            "附餐選擇_Choose_Side_Dis",
            "咖哩醬加點_Curry_Sauce_Ad_88123",
            "咖哩飯加點_Add_On",
          ],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "炸雞塊菠菜咖哩飯_Fried_Chick",
        external_data: "XA016",
        title: {
          translations: {
            en: "炸雞塊菠菜咖哩飯 Fried Chicken Thigh Curry with Spinach",
          },
        },
        description: {
          translations: {
            en: "含主餐及附餐。圖片僅供參考, 餐點以實物為準。",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/9ff083fcc7b6f7ba483970f705144f48/a1681d67ebe55c76c3af5f401619c278.jpeg",
        price_info: {
          price: 38200,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        modifier_group_ids: {
          ids: [
            "飯量選擇_Choose_Rice",
            "辣度_Spicy_Level",
            "附餐選擇_Choose_Side_Dis",
            "咖哩醬加點_Curry_Sauce_Ad_88123",
            "咖哩飯加點_Add_On",
          ],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["CAT_PREPARED_FOOD", "TEMP_HEATED"],
            source: "MANUAL",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "歐姆蛋奶油雞肉咖哩飯_Omelet_Ri",
        external_data: "XA025",
        title: {
          translations: {
            en: "歐姆蛋奶油雞肉咖哩飯 Omelet Rice Curry  with Chicken Cream",
          },
        },
        description: {
          translations: {
            en: "固定飯量 200 克。含主餐及附餐。圖片僅供參考, 餐點以實物為準。",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/8485de8c72bcb4497931be1b8e318994/a1681d67ebe55c76c3af5f401619c278.jpeg",
        price_info: {
          price: 37600,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        modifier_group_ids: {
          ids: [
            "辣度_Spicy_Level",
            "附餐選擇_Choose_Side_Dis",
            "咖哩醬加點_Curry_Sauce_Ad_88123",
            "咖哩飯加點_Add_On",
          ],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "玉米_Corn",
        external_data: "XF16",
        title: {
          translations: {
            en: "玉米 Corn",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 2000,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              price: 2000,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "拉麵配菜加購_Ramen_Add_On",
              price: 2000,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              quantity: {
                max_permitted: 1,
              },
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "拉麵配菜加購_Ramen_Add_On",
              quantity: {},
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              ids: null,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "拉麵配菜加購_Ramen_Add_On",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "普通_(微辣)_Standard_Spi",
        external_data: "XD02",
        title: {
          translations: {
            en: "普通 (微辣) Standard Spicy",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 0,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "麻婆辣度選擇_Mabo_Spicy_Le",
              price: 0,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食辣度選擇_Vegetarian_Sp_59537",
              price: 0,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "麻婆辣度選擇_Mabo_Spicy_Le",
              quantity: {
                max_permitted: 1,
              },
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食辣度選擇_Vegetarian_Sp_59537",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "麻婆辣度選擇_Mabo_Spicy_Le",
              ids: null,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食辣度選擇_Vegetarian_Sp_59537",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "歐姆蛋日式牛肉燴飯_Omelet_Ric",
        external_data: "XA026",
        title: {
          translations: {
            en: "歐姆蛋日式牛肉燴飯 Omelet Rice Hashed Beef",
          },
        },
        description: {
          translations: {
            en: "固定飯量 200 克。含主餐及附餐。牛肉來源: 美國。圖片僅供參考, 餐點以實物為準。",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/b73861bf6294f7a8b3c41084fabb0e70/a1681d67ebe55c76c3af5f401619c278.jpeg",
        price_info: {
          price: 47500,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        modifier_group_ids: {
          ids: ["附餐選擇_Choose_Side_Dis", "咖哩飯加點_Add_On"],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "炸雞排起士咖哩飯_Chicken_Cut",
        external_data: "XA030",
        title: {
          translations: {
            en: "炸雞排起士咖哩飯 Chicken Cutlet Curry with Cheese",
          },
        },
        description: {
          translations: {
            en: "含主餐及附餐。圖片僅供參考, 餐點以實物為準。",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/b8232e7e1f720f2a7e8e8441131ae189/a1681d67ebe55c76c3af5f401619c278.jpeg",
        price_info: {
          price: 39300,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        modifier_group_ids: {
          ids: [
            "飯量選擇_Choose_Rice",
            "辣度_Spicy_Level",
            "附餐選擇_Choose_Side_Dis",
            "咖哩醬加點_Curry_Sauce_Ad_88123",
            "咖哩飯加點_Add_On",
          ],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "茄子_(6_塊)_Eggplant_(6",
        external_data: "XF19",
        title: {
          translations: {
            en: "茄子 (6 塊) Eggplant (6 Pieces)",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 4000,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              price: 4000,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "起士_Cheese",
        external_data: "XF24",
        title: {
          translations: {
            en: "起士 Cheese",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 5000,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "拉麵配菜加購_Ramen_Add_On",
              price: 5000,
            },
          ],
        },
        quantity_info: {
          quantity: {},
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "拉麵配菜加購_Ramen_Add_On",
              quantity: {},
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "拉麵配菜加購_Ramen_Add_On",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED", "CAT_PREPARED_FOOD"],
            source: "DEFAULT",
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "白花椰菜(3_個)_Cauliflowe",
        external_data: "XF42",
        title: {
          translations: {
            en: "白花椰菜(3 個) Cauliflower (3 Pieces)",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 2500,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              price: 2500,
            },
          ],
        },
        quantity_info: {
          quantity: {},
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              quantity: {},
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "燉雞肉咖哩烏龍麵_Curry_Udon_",
        external_data: "XA256",
        title: {
          translations: {
            en: "燉雞肉咖哩烏龍麵 Curry Udon with Stewed Chicken",
          },
        },
        description: {
          translations: {
            en: "含主餐及附餐。餐點圖片僅供參考, 食材供應將依時令季節調整。圖片僅供參考, 餐點以實物為準。",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/924f0955acaf1417970aaec6b2940330/a1681d67ebe55c76c3af5f401619c278.jpeg",
        price_info: {
          price: 38200,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        modifier_group_ids: {
          ids: ["附餐選擇_Choose_Side_Dis", "咖哩飯加點_Add_On"],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "炸雞塊‧蔬菜湯咖哩_(附_150_克飯)",
        external_data: "XA022",
        title: {
          translations: {
            en: "炸雞塊‧蔬菜湯咖哩 (附 150 克飯) Fried Chicken and Vegetable Soup Curry with Rice",
          },
        },
        description: {
          translations: {
            en: "固定白飯 150 克。含主餐及附餐。圖片僅供參考, 餐點以實物為準。",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/1b053d156d0dc72ebabefd612181f6b7/a1681d67ebe55c76c3af5f401619c278.jpeg",
        price_info: {
          price: 40900,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        modifier_group_ids: {
          ids: ["附餐選擇_Choose_Side_Dis", "咖哩飯加點_Add_On"],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "玉米可樂餅(2塊)",
        external_data: "XF48",
        title: {
          translations: {
            en: "玉米可樂餅(2塊)",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 10000,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              price: 10000,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "無咖啡茶_Hot_Non-Caffein",
        external_data: "XA14",
        title: {
          translations: {
            en: "無咖啡茶 Hot Non-Caffeine Tea",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 0,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飲品選擇_Choose_Beverage",
              price: 0,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飲品選擇_Choose_Beverage",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        suspension_info: {
          suspension: {
            suspend_until: 8640000000,
          },
          overrides: [],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飲品選擇_Choose_Beverage",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED", "CAT_PREPARED_FOOD"],
            source: "DEFAULT",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "10_辛_(無限辣)_Death_Spi",
        external_data: "XD08",
        title: {
          translations: {
            en: "10 辛 (無限辣) Death Spicy",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 3000,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食辣度選擇_Vegetarian_Sp_59537",
              price: 3000,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "辣度_Spicy_Level",
              price: 3000,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "麻婆辣度選擇_Mabo_Spicy_Le",
              price: 3000,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食辣度選擇_Vegetarian_Sp",
              price: 3000,
            },
          ],
        },
        quantity_info: {
          quantity: {},
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食辣度選擇_Vegetarian_Sp_59537",
              quantity: {},
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "辣度_Spicy_Level",
              quantity: {},
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "麻婆辣度選擇_Mabo_Spicy_Le",
              quantity: {},
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食辣度選擇_Vegetarian_Sp",
              quantity: {},
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食辣度選擇_Vegetarian_Sp_59537",
              ids: null,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "辣度_Spicy_Level",
              ids: null,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "麻婆辣度選擇_Mabo_Spicy_Le",
              ids: null,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食辣度選擇_Vegetarian_Sp",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "熱咖啡_Hot_Coffee",
        external_data: "XA04",
        title: {
          translations: {
            en: "熱咖啡 Hot Coffee",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 0,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飲品選擇_Choose_Beverage",
              price: 0,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飲品選擇_Choose_Beverage",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飲品選擇_Choose_Beverage",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED", "CAT_PREPARED_FOOD"],
            source: "DEFAULT",
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "水蜜桃紅茶_Peach_Black_Te",
        external_data: "XA21",
        title: {
          translations: {
            en: "水蜜桃紅茶 Peach Black Tea",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 0,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飲品選擇_Choose_Beverage",
              price: 0,
            },
          ],
        },
        quantity_info: {
          quantity: {},
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飲品選擇_Choose_Beverage",
              quantity: {},
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飲品選擇_Choose_Beverage",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "海鮮咖哩飯_Seafood_Curry",
        external_data: "XA007",
        title: {
          translations: {
            en: "海鮮咖哩飯 Seafood Curry",
          },
        },
        description: {
          translations: {
            en: "含主餐及附餐。圖片僅供參考, 餐點以實物為準。",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/338e598596bc48cb2302005322be841d/a1681d67ebe55c76c3af5f401619c278.jpeg",
        price_info: {
          price: 40900,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        modifier_group_ids: {
          ids: [
            "飯量選擇_Choose_Rice",
            "辣度_Spicy_Level",
            "附餐選擇_Choose_Side_Dis",
            "咖哩醬加點_Curry_Sauce_Ad_88123",
            "咖哩飯加點_Add_On",
          ],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED", "CAT_PREPARED_FOOD"],
            source: "DEFAULT",
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "冷凍素食咖哩醬_Frozen_Vegan",
        external_data: "QA031",
        title: {
          translations: {
            en: "冷凍素食咖哩醬 Frozen Vegan Curry Sauce",
          },
        },
        description: {
          translations: {
            en: "素食咖哩醬220ｇ。圖片僅供參考, 餐點以實物為準。",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/0bde159db6dd911e97c134310dadc3b7/c67fc65e9b4e16a553eb7574fba090f1.jpeg",
        price_info: {
          price: 15400,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        suspension_info: {
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            dietary_label_info: {
              labels: ["VEGETARIAN", "VEGAN"],
            },
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_COLD"],
            source: "MANUAL",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "海鮮_Seafood",
        external_data: "XF15",
        title: {
          translations: {
            en: "海鮮 Seafood",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 15000,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              price: 15000,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED", "CAT_PREPARED_FOOD"],
            source: "DEFAULT",
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "普通_(標準)_Regular_Spic",
        external_data: "XD02",
        title: {
          translations: {
            en: "普通 (標準) Regular Spicy",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 0,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "辣度_Spicy_Level",
              price: 0,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食辣度選擇_Vegetarian_Sp",
              price: 0,
            },
          ],
        },
        quantity_info: {
          quantity: {},
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "辣度_Spicy_Level",
              quantity: {},
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食辣度選擇_Vegetarian_Sp",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "辣度_Spicy_Level",
              ids: null,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食辣度選擇_Vegetarian_Sp",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "4_辛_(重辣)_Super_Spicy",
        external_data: "XD06",
        title: {
          translations: {
            en: "4 辛 (重辣) Super Spicy",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 0,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "辣度_Spicy_Level",
              price: 0,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "麻婆辣度選擇_Mabo_Spicy_Le",
              price: 0,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食辣度選擇_Vegetarian_Sp",
              price: 0,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食辣度選擇_Vegetarian_Sp_59537",
              price: 0,
            },
          ],
        },
        quantity_info: {
          quantity: {},
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "辣度_Spicy_Level",
              quantity: {},
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "麻婆辣度選擇_Mabo_Spicy_Le",
              quantity: {
                max_permitted: 1,
              },
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食辣度選擇_Vegetarian_Sp",
              quantity: {
                max_permitted: 1,
              },
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食辣度選擇_Vegetarian_Sp_59537",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "辣度_Spicy_Level",
              ids: null,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "麻婆辣度選擇_Mabo_Spicy_Le",
              ids: null,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食辣度選擇_Vegetarian_Sp",
              ids: null,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食辣度選擇_Vegetarian_Sp_59537",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "素食咖哩醬加量_Extra_Vegeta",
        external_data: "XI01",
        title: {
          translations: {
            en: "素食咖哩醬加量 Extra Vegetarian Curry Sauce",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 6000,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食咖哩醬加購_Vegetarian_C",
              price: 6000,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食咖哩醬加購_Vegetarian_C",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食咖哩醬加購_Vegetarian_C",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED", "CAT_PREPARED_FOOD"],
            source: "DEFAULT",
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "冷凍辣味咖哩醬_Frozen_Spicy",
        external_data: "QA029",
        title: {
          translations: {
            en: "冷凍辣味咖哩醬 Frozen Spicy Curry Sauce",
          },
        },
        description: {
          translations: {
            en: "辣味咖哩醬220ｇ。圖片僅供參考, 餐點以實物為準。",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/fa5b268a986657e483790a6a34ea8497/c67fc65e9b4e16a553eb7574fba090f1.jpeg",
        price_info: {
          price: 11600,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        suspension_info: {
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            dietary_label_info: {
              labels: [],
            },
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_COLD"],
            source: "MANUAL",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "熱日本茶_Hot_Japanese_Te",
        external_data: "XA19",
        title: {
          translations: {
            en: "熱日本茶 Hot Japanese Tea",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 0,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飲品選擇_Choose_Beverage",
              price: 0,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飲品選擇_Choose_Beverage",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飲品選擇_Choose_Beverage",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED", "CAT_PREPARED_FOOD"],
            source: "DEFAULT",
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "炸雞塊咖哩飯_Fried_Chicken_67770",
        external_data: "XA004",
        title: {
          translations: {
            en: "炸雞塊咖哩飯 Fried Chicken Thigh Curry",
          },
        },
        description: {
          translations: {
            en: "含主餐及附餐。圖片僅供參考, 餐點以實物為準。",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/30672d6dc509fde206b796f3d4e67b4e/a1681d67ebe55c76c3af5f401619c278.jpeg",
        price_info: {
          price: 33800,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        modifier_group_ids: {
          ids: [
            "飯量選擇_Choose_Rice",
            "辣度_Spicy_Level",
            "附餐選擇_Choose_Side_Dis",
            "咖哩醬加點_Curry_Sauce_Ad_88123",
            "咖哩飯加點_Add_On",
          ],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "炸豬排咖哩飯_Pork_Cutlet_C_79587",
        external_data: "XA003",
        title: {
          translations: {
            en: "炸豬排咖哩飯 Pork Cutlet Curry",
          },
        },
        description: {
          translations: {
            en: "含主餐及附餐。豬肉來源: 加拿大。圖片僅供參考, 餐點以實物為準。",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/b80af61f18257f2874b6bdc5d844d6b9/a1681d67ebe55c76c3af5f401619c278.jpeg",
        price_info: {
          price: 38200,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        modifier_group_ids: {
          ids: [
            "飯量選擇_Choose_Rice",
            "辣度_Spicy_Level",
            "附餐選擇_Choose_Side_Dis",
            "咖哩醬加點_Curry_Sauce_Ad_88123",
            "咖哩飯加點_Add_On",
          ],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "起士_(H)_(蛋素可選)_Half_C",
        external_data: "XF35",
        title: {
          translations: {
            en: "起士 (H) (蛋素可選) Half Cheese",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 3000,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              price: 3000,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "燉雞肉咖哩飯_Stewed_Chicke",
        external_data: "XA021",
        title: {
          translations: {
            en: "燉雞肉咖哩飯 Stewed Chicken Curry",
          },
        },
        description: {
          translations: {
            en: "含主餐及附餐。圖片僅供參考, 餐點以實物為準。",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/9c1311c4a683b457b06216a495896884/a1681d67ebe55c76c3af5f401619c278.jpeg",
        price_info: {
          price: 33200,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        modifier_group_ids: {
          ids: [
            "飯量選擇_Choose_Rice",
            "辣度_Spicy_Level",
            "附餐選擇_Choose_Side_Dis",
            "咖哩醬加點_Curry_Sauce_Ad_88123",
            "咖哩飯加點_Add_On",
          ],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "蔬菜_Vegetable_62164",
        external_data: "XF21",
        title: {
          translations: {
            en: "蔬菜 Vegetable",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 7500,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              price: 7500,
            },
          ],
        },
        quantity_info: {
          quantity: {},
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              quantity: {},
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "歐姆蛋炸雞塊番茄青花椰菜咖哩飯_Omel",
        external_data: "XA027",
        title: {
          translations: {
            en: "歐姆蛋炸雞塊番茄青花椰菜咖哩飯 Omelet Rice Fried Chicken Curry with Tomato and Broccoli",
          },
        },
        description: {
          translations: {
            en: "固定飯量 200 克。含主餐及附餐。圖片僅供參考, 餐點以實物為準。",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/ebef983b322c4799e3e8d6c5f97bb4ae/a1681d67ebe55c76c3af5f401619c278.jpeg",
        price_info: {
          price: 45900,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        modifier_group_ids: {
          ids: [
            "辣度_Spicy_Level",
            "附餐選擇_Choose_Side_Dis",
            "咖哩醬加點_Curry_Sauce_Ad_88123",
            "咖哩飯加點_Add_On",
          ],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "1_辛_(小辣)_Medium_Spic",
        external_data: "XD03",
        title: {
          translations: {
            en: "1 辛 (小辣) Medium Spicy",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 0,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "辣度_Spicy_Level",
              price: 0,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食辣度選擇_Vegetarian_Sp",
              price: 0,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "麻婆辣度選擇_Mabo_Spicy_Le",
              price: 0,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食辣度選擇_Vegetarian_Sp_59537",
              price: 0,
            },
          ],
        },
        quantity_info: {
          quantity: {},
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "辣度_Spicy_Level",
              quantity: {},
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食辣度選擇_Vegetarian_Sp",
              quantity: {
                max_permitted: 1,
              },
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "麻婆辣度選擇_Mabo_Spicy_Le",
              quantity: {
                max_permitted: 1,
              },
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食辣度選擇_Vegetarian_Sp_59537",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "辣度_Spicy_Level",
              ids: null,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食辣度選擇_Vegetarian_Sp",
              ids: null,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "麻婆辣度選擇_Mabo_Spicy_Le",
              ids: null,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食辣度選擇_Vegetarian_Sp_59537",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "冰柳橙汁_Iced_Orange_Jui_97347",
        external_data: "XA12",
        title: {
          translations: {
            en: "冰柳橙汁 Iced Orange Juice",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 0,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飲品選擇_Choose_Beverage",
              price: 0,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飲品選擇_Choose_Beverage",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飲品選擇_Choose_Beverage",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "炸豬排咖哩拉麵_Ramen_with_D",
        external_data: "XA205",
        title: {
          translations: {
            en: "炸豬排咖哩拉麵 Ramen with Deep-Fried Pork Chop and Curry",
          },
        },
        description: {
          translations: {
            en: "含主餐及附餐。味噌絞肉豬肉來源：台灣, 炸豬排豬肉來源：加拿大。餐點圖片僅供參考, 食材供應將依時令季節調整。圖片僅供參考, 餐點以實物為準。",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/da5338d25853f6efaaf607a3f20dd10e/a1681d67ebe55c76c3af5f401619c278.jpeg",
        price_info: {
          price: 47500,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        suspension_info: {
          overrides: [],
        },
        modifier_group_ids: {
          ids: ["附餐選擇_Choose_Side_Dis", "拉麵配菜加購_Ramen_Add_On"],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED", "CAT_PREPARED_FOOD"],
            source: "DEFAULT",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "青花椰菜_(3_個)_Broccoli__97853",
        external_data: "XF38",
        title: {
          translations: {
            en: "青花椰菜 (3 個) Broccoli (3 Pieces)",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 2500,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              price: 2500,
            },
          ],
        },
        quantity_info: {
          quantity: {},
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              quantity: {},
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "麻婆蝦仁咖哩飯_MABO_Curry_w",
        external_data: "XA029",
        title: {
          translations: {
            en: "麻婆蝦仁咖哩飯 MABO Curry with Stewed Shrimp",
          },
        },
        description: {
          translations: {
            en: "固定飯量 200 克。含主餐及附餐。豬肉來源: 巴拉圭。圖片僅供參考, 餐點以實物為準。",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/9c92b33dc60220b27c080929d7b75992/a1681d67ebe55c76c3af5f401619c278.jpeg",
        price_info: {
          price: 47000,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        modifier_group_ids: {
          ids: [
            "飯量選擇_Choose_Rice",
            "麻婆辣度選擇_Mabo_Spicy_Le",
            "附餐選擇_Choose_Side_Dis",
            "咖哩飯加點_Add_On",
          ],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "馬鈴薯_Potato",
        external_data: "XF44",
        title: {
          translations: {
            en: "馬鈴薯 Potato",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 4000,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              price: 4000,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              price: 4000,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              quantity: {
                max_permitted: 1,
              },
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              quantity: {},
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              ids: null,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "U_炸雞塊歐姆蛋咖哩飯_U_Omelet",
        external_data: "XA802",
        title: {
          translations: {
            en: "U 炸雞塊歐姆蛋咖哩飯 U Omelet Curry Rice with Fried Chicken Thigh",
          },
        },
        description: {
          translations: {
            en: "固定飯量 200 克。含主餐及柳橙汁 1 杯。圖片僅供參考, 餐點以實物為準。",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/1c0b599a20afedfc2c99af68b7b4cdf2/c67fc65e9b4e16a553eb7574fba090f1.jpeg",
        price_info: {
          price: 33100,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        suspension_info: {
          suspension: {
            suspend_until: 8640000000,
          },
          overrides: [],
        },
        modifier_group_ids: {
          ids: ["辣度_Spicy_Level", "飲料_Beverage_42148"],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "白花椰菜(3個)_Cauliflower",
        external_data: "XF42",
        title: {
          translations: {
            en: "白花椰菜(3個) Cauliflower (3 Pieces)",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 2500,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              price: 2500,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "因應政府規定不得免費提供一次性餐具之政策",
        external_data: "",
        title: {
          translations: {
            en: "因應政府規定不得免費提供一次性餐具之政策, 於外送平台之餐點價格皆已調整為包含外帶餐盒, 外帶餐具及外帶提袋之費用。",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 0,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "茄子_(3_塊)_Eggplant_(3",
        external_data: "XF32",
        title: {
          translations: {
            en: "茄子 (3 塊) Eggplant (3 Pieces)",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 2500,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              price: 2500,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "玉米筍_Baby_Corn",
        external_data: "XF45",
        title: {
          translations: {
            en: "玉米筍 Baby Corn",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 4000,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              price: 4000,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              price: 4000,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              quantity: {
                max_permitted: 1,
              },
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              quantity: {},
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              ids: null,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "250_克(標準)_250g(Stand",
        external_data: "XC00",
        title: {
          translations: {
            en: "250 克(標準) 250g(Standard)",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 0,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飯量選擇_Choose_Rice",
              price: 0,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飯量選擇_Choose_Rice",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飯量選擇_Choose_Rice",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "蕃茄青花椰菜_Tomato_and_Br_91789",
        external_data: "XF28",
        title: {
          translations: {
            en: "蕃茄青花椰菜 Tomato and Broccoli",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 6500,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              price: 6500,
            },
          ],
        },
        quantity_info: {
          quantity: {},
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              quantity: {},
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "起士條_(2_條)_Fried_Chee",
        external_data: "XF36",
        title: {
          translations: {
            en: "起士條 (2 條) Fried Cheese Sticks (2 Pieces)",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 4500,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              price: 4500,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "冰咖啡_Iced_Coffee",
        external_data: "XA05",
        title: {
          translations: {
            en: "冰咖啡 Iced Coffee",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 0,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飲品選擇_Choose_Beverage",
              price: 0,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飲品選擇_Choose_Beverage",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        suspension_info: {
          overrides: [],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飲品選擇_Choose_Beverage",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED", "CAT_PREPARED_FOOD"],
            source: "DEFAULT",
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "茄子咖哩飯_Eggplant_Curry",
        external_data: "XA010",
        title: {
          translations: {
            en: "茄子咖哩飯 Eggplant Curry",
          },
        },
        description: {
          translations: {
            en: "含主餐及附餐。圖片僅供參考, 餐點以實物為準。",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/88b7b7e01cede33a765ef734f0e92ae4/a1681d67ebe55c76c3af5f401619c278.jpeg",
        price_info: {
          price: 28800,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        modifier_group_ids: {
          ids: [
            "飯量選擇_Choose_Rice",
            "辣度_Spicy_Level",
            "附餐選擇_Choose_Side_Dis",
            "咖哩醬加點_Curry_Sauce_Ad_88123",
            "咖哩飯加點_Add_On",
          ],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "素食麻婆咖哩飯_MABO_Vegetar",
        external_data: "XA103",
        title: {
          translations: {
            en: "素食麻婆咖哩飯 MABO Vegetarian Curry",
          },
        },
        description: {
          translations: {
            en: "全素咖哩醬 (微辣)。含主餐及附餐。圖片僅供參考, 餐點以實物為準。",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/dbc48d7b458c36e24127a9d809c97f69/a1681d67ebe55c76c3af5f401619c278.jpeg",
        price_info: {
          price: 40400,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        modifier_group_ids: {
          ids: [
            "飯量選擇_Choose_Rice",
            "素食辣度選擇_Vegetarian_Sp_59537",
            "附餐選項_Choose_Side_Dis",
            "素食咖哩醬加購_Vegetarian_C",
            "素食配菜加購_Vegetarian_Ad",
          ],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            dietary_label_info: {
              labels: ["VEGETARIAN", "VEGAN"],
            },
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "冰烏龍茶_Iced_Oolong_Tea",
        external_data: "XA08",
        title: {
          translations: {
            en: "冰烏龍茶 Iced Oolong Tea",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 0,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飲品選擇_Choose_Beverage",
              price: 0,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飲品選擇_Choose_Beverage",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飲品選擇_Choose_Beverage",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED", "CAT_PREPARED_FOOD"],
            source: "DEFAULT",
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "起士條_(3_條)_Cheese_Sti",
        external_data: "XF25",
        title: {
          translations: {
            en: "起士條 (3 條) Cheese Stick (3 Pieces)",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 6000,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              price: 6000,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "綜合菇_Assorted_Mushroo_01384",
        external_data: "XF22",
        title: {
          translations: {
            en: "綜合菇 Assorted Mushroom",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 7000,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              price: 7000,
            },
          ],
        },
        quantity_info: {
          quantity: {},
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              quantity: {},
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "綜合菇咖哩飯_Assorted_Mush_83605",
        external_data: "XA011",
        title: {
          translations: {
            en: "綜合菇咖哩飯 Assorted Mushroom Curry",
          },
        },
        description: {
          translations: {
            en: "含主餐及附餐。圖片僅供參考, 餐點以實物為準。",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/21edcb4e437068e3fee4d7ba936d60e6/a1681d67ebe55c76c3af5f401619c278.jpeg",
        price_info: {
          price: 32100,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        modifier_group_ids: {
          ids: [
            "飯量選擇_Choose_Rice",
            "辣度_Spicy_Level",
            "附餐選擇_Choose_Side_Dis_40352",
            "咖哩醬加點_Curry_Sauce_Ad_88123",
            "咖哩飯加點_Add_On",
          ],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "白飯_Rice",
        external_data: "XF29",
        title: {
          translations: {
            en: "白飯 Rice",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 2000,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "拉麵配菜加購_Ramen_Add_On",
              price: 2000,
            },
          ],
        },
        quantity_info: {
          quantity: {},
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "拉麵配菜加購_Ramen_Add_On",
              quantity: {},
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "拉麵配菜加購_Ramen_Add_On",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED", "CAT_PREPARED_FOOD"],
            source: "DEFAULT",
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "例湯_Soup",
        external_data: "XA03",
        title: {
          translations: {
            en: "例湯 Soup",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 0,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "附餐選擇_Choose_Side_Dis",
              price: 0,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "附餐選擇_Choose_Side_Dis_40352",
              price: 0,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "附餐選擇_Choose_Side_Dis",
              quantity: {
                max_permitted: 1,
              },
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "附餐選擇_Choose_Side_Dis_40352",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        suspension_info: {
          suspension: {
            suspend_until: 1781985600,
          },
          overrides: [],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "附餐選擇_Choose_Side_Dis",
              ids: null,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "附餐選擇_Choose_Side_Dis_40352",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED", "CAT_PREPARED_FOOD"],
            source: "DEFAULT",
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "綜合菇咖哩飯_Assorted_Mush",
        external_data: "XA011",
        title: {
          translations: {
            en: "綜合菇咖哩飯 Assorted Mushroom Curry",
          },
        },
        description: {
          translations: {
            en: "含主餐及附餐。圖片僅供參考, 餐點以實物為準。",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/21edcb4e437068e3fee4d7ba936d60e6/a1681d67ebe55c76c3af5f401619c278.jpeg",
        price_info: {
          price: 32100,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        modifier_group_ids: {
          ids: [
            "飯量選擇_Choose_Rice",
            "辣度_Spicy_Level",
            "附餐選擇_Choose_Side_Dis",
            "咖哩醬加點_Curry_Sauce_Ad_88123",
            "咖哩飯加點_Add_On",
          ],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED", "CAT_PREPARED_FOOD"],
            source: "DEFAULT",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "起士_(奶素可選)_Cheese_(La_79818",
        external_data: "XF24",
        title: {
          translations: {
            en: "起士 (奶素可選) Cheese (Lacto Vegetarian)",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 5000,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              price: 5000,
            },
          ],
        },
        quantity_info: {
          quantity: {},
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              quantity: {},
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "綜合菇咖哩烏龍麵_Curry_Udon_",
        external_data: "XA253",
        title: {
          translations: {
            en: "綜合菇咖哩烏龍麵 Curry Udon with Assorted Mushroom",
          },
        },
        description: {
          translations: {
            en: "含主餐及附餐。圖片僅供參考, 餐點以實物為準。",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/933b07185dbbcfe503780ed2d889581e/a1681d67ebe55c76c3af5f401619c278.jpeg",
        price_info: {
          price: 37100,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        suspension_info: {
          overrides: [],
        },
        modifier_group_ids: {
          ids: ["附餐選擇_Choose_Side_Dis", "咖哩飯加點_Add_On"],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "2_辛_(中辣)_Spicy",
        external_data: "XD04",
        title: {
          translations: {
            en: "2 辛 (中辣) Spicy",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 0,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食辣度選擇_Vegetarian_Sp_59537",
              price: 0,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "辣度_Spicy_Level",
              price: 0,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "麻婆辣度選擇_Mabo_Spicy_Le",
              price: 0,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食辣度選擇_Vegetarian_Sp",
              price: 0,
            },
          ],
        },
        quantity_info: {
          quantity: {},
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食辣度選擇_Vegetarian_Sp_59537",
              quantity: {
                max_permitted: 1,
              },
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "辣度_Spicy_Level",
              quantity: {},
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "麻婆辣度選擇_Mabo_Spicy_Le",
              quantity: {
                max_permitted: 1,
              },
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食辣度選擇_Vegetarian_Sp",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食辣度選擇_Vegetarian_Sp_59537",
              ids: null,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "辣度_Spicy_Level",
              ids: null,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "麻婆辣度選擇_Mabo_Spicy_Le",
              ids: null,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食辣度選擇_Vegetarian_Sp",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "白花椰菜_Cauliflower",
        external_data: "XF41",
        title: {
          translations: {
            en: "白花椰菜 Cauliflower",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 4000,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              price: 4000,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              price: 4000,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              quantity: {
                max_permitted: 1,
              },
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              quantity: {},
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              ids: null,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "香脆雞腿排咖哩飯_Lightly_Cri",
        external_data: "XA031",
        title: {
          translations: {
            en: "香脆雞腿排咖哩飯 Lightly Crisped Chicken Curry",
          },
        },
        description: {
          translations: {
            en: "含主餐及附餐。圖片僅供參考, 餐點以實物為準。",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/a436187ff4fab8a4dc73a45958028084/a1681d67ebe55c76c3af5f401619c278.jpeg",
        price_info: {
          price: 33800,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        modifier_group_ids: {
          ids: [
            "飯量選擇_Choose_Rice",
            "辣度_Spicy_Level",
            "附餐選擇_Choose_Side_Dis",
            "咖哩飯加點_Add_On",
            "咖哩醬加點_Curry_Sauce_Ad_88123",
          ],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "香脆雞腿排_Crispy_Chicken",
        external_data: "XF46",
        title: {
          translations: {
            en: "香脆雞腿排 Crispy Chicken Thigh",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 8500,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              price: 8500,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "冷凍不辣咖哩醬_Frozen_Non-S",
        external_data: "QA039",
        title: {
          translations: {
            en: "冷凍不辣咖哩醬 Frozen Non-Spicy Curry Sauce",
          },
        },
        description: {
          translations: {
            en: "不辣咖哩醬220ｇ。圖片僅供參考, 餐點以實物為準。",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/3fad9e599e54d28dd00e46b7e39dd3ae/c67fc65e9b4e16a553eb7574fba090f1.jpeg",
        price_info: {
          price: 11600,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        suspension_info: {
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            dietary_label_info: {
              labels: [],
            },
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED", "CAT_PREPARED_FOOD"],
            source: "DEFAULT",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "秋葵豆腐_Okra_Tofu",
        external_data: "XF43",
        title: {
          translations: {
            en: "秋葵豆腐 Okra Tofu",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 4500,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              price: 4500,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              price: 4500,
            },
          ],
        },
        quantity_info: {
          quantity: {},
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              quantity: {},
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              ids: null,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "涮牛肉咖哩拉麵_Ramen_with_B",
        external_data: "XA203",
        title: {
          translations: {
            en: "涮牛肉咖哩拉麵 Ramen with Blanched Beef and Curry",
          },
        },
        description: {
          translations: {
            en: "含主餐及附餐。味噌絞肉－豬肉來源：台灣、涮牛肉－牛肉來源：美國。餐點圖片僅供參考, 食材供應將依時令季節調整。圖片僅供參考, 餐點以實物為準。",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/40043371061e7921f78d9185b6f1481d/a1681d67ebe55c76c3af5f401619c278.jpeg",
        price_info: {
          price: 43100,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        suspension_info: {
          overrides: [],
        },
        modifier_group_ids: {
          ids: ["附餐選擇_Choose_Side_Dis", "拉麵配菜加購_Ramen_Add_On"],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED", "CAT_PREPARED_FOOD"],
            source: "DEFAULT",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "起士咖哩飯_Cheese_Curry",
        external_data: "XA012",
        title: {
          translations: {
            en: "起士咖哩飯 Cheese Curry",
          },
        },
        description: {
          translations: {
            en: "含主餐及附餐。圖片僅供參考, 餐點以實物為準。",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/810605a6e7a5b2645c6876e498979f0e/a1681d67ebe55c76c3af5f401619c278.jpeg",
        price_info: {
          price: 29900,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        modifier_group_ids: {
          ids: [
            "飯量選擇_Choose_Rice",
            "辣度_Spicy_Level",
            "附餐選擇_Choose_Side_Dis",
            "咖哩醬加點_Curry_Sauce_Ad_88123",
            "咖哩飯加點_Add_On",
          ],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["CAT_PREPARED_FOOD", "TEMP_HEATED"],
            source: "MANUAL",
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "炸蝦_(2_尾)_Fried_Shrim",
        external_data: "XF13",
        title: {
          translations: {
            en: "炸蝦 (2 尾) Fried Shrimp (2 Pieces)",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 13500,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              price: 13500,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "冰紅茶_Iced_Black_Tea",
        external_data: "XA07",
        title: {
          translations: {
            en: "冰紅茶 Iced Black Tea",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 0,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飲品選擇_Choose_Beverage",
              price: 0,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飲品選擇_Choose_Beverage",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飲品選擇_Choose_Beverage",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED", "CAT_PREPARED_FOOD"],
            source: "DEFAULT",
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "素食舒植肉丸咖哩飯_Plant-base",
        external_data: "XA104",
        title: {
          translations: {
            en: "素食舒植肉丸咖哩飯 Plant-based Meatball Curry",
          },
        },
        description: {
          translations: {
            en: "全素咖哩醬 (微辣)。含主餐及附餐。圖片僅供參考, 餐點以實物為準。",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/f620de3788968d3d85d3d9c7ff991064/a1681d67ebe55c76c3af5f401619c278.jpeg",
        price_info: {
          price: 37100,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        modifier_group_ids: {
          ids: [
            "飯量選擇_Choose_Rice",
            "素食辣度選擇_Vegetarian_Sp",
            "附餐選項_Choose_Side_Dis",
            "素食咖哩醬加購_Vegetarian_C",
            "素食配菜加購_Vegetarian_Ad",
          ],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            dietary_label_info: {
              labels: ["VEGETARIAN", "VEGAN"],
            },
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "蔬菜_Vegetable",
        external_data: "XF21",
        title: {
          translations: {
            en: "蔬菜 Vegetable",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 7500,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              price: 7500,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "炸豬排咖哩飯_Pork_Cutlet_C",
        external_data: "XA003",
        title: {
          translations: {
            en: "炸豬排咖哩飯 Pork Cutlet Curry",
          },
        },
        description: {
          translations: {
            en: "含主餐及附餐。豬肉來源:  加拿大或台灣。圖片僅供參考, 餐點以實物為準。",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/b80af61f18257f2874b6bdc5d844d6b9/a1681d67ebe55c76c3af5f401619c278.jpeg",
        price_info: {
          price: 38200,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        suspension_info: {
          overrides: [],
        },
        modifier_group_ids: {
          ids: [
            "飯量選擇_Choose_Rice",
            "辣度_Spicy_Level",
            "附餐選擇_Choose_Side_Dis",
            "咖哩醬加點_Curry_Sauce_Ad_88123",
            "咖哩飯加點_Add_On",
          ],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["CAT_PREPARED_FOOD", "TEMP_HEATED"],
            source: "MANUAL",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "水煮蛋_(蛋素可選)_Hard_Boil_46128",
        external_data: "XF23",
        title: {
          translations: {
            en: "水煮蛋 (蛋素可選) Hard Boiled Egg (Ovo Vegetarian)",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 2000,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              price: 2000,
            },
          ],
        },
        quantity_info: {
          quantity: {},
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              quantity: {},
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "咖哩拉麵_Ramen_with_Curr_45600",
        external_data: "XA201",
        title: {
          translations: {
            en: "咖哩拉麵 Ramen with Curry",
          },
        },
        description: {
          translations: {
            en: "含主餐及附餐。味噌絞肉豬肉來源: 台灣。餐點圖片僅供參考, 食材供應將依時令季節調整。圖片僅供參考, 餐點以實物為準。",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/27773e0ddb5121eebc94f374eba87a48/a1681d67ebe55c76c3af5f401619c278.jpeg",
        price_info: {
          price: 33800,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        modifier_group_ids: {
          ids: ["附餐選擇_Choose_Side_Dis", "拉麵配菜加購_Ramen_Add_On"],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "歐姆蛋麻婆咖哩飯_Omelet_Rice",
        external_data: "XA020",
        title: {
          translations: {
            en: "歐姆蛋麻婆咖哩飯 Omelet Rice MABO Curry",
          },
        },
        description: {
          translations: {
            en: "固定飯量 200 克。含主餐及附餐。豬肉來源: 巴拉圭。圖片僅供參考, 餐點以實物為準。",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/abfd9615f9fa9ae2d3a7d8ee00f64ea2/a1681d67ebe55c76c3af5f401619c278.jpeg",
        price_info: {
          price: 38200,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        modifier_group_ids: {
          ids: [
            "麻婆辣度選擇_Mabo_Spicy_Le",
            "附餐選擇_Choose_Side_Dis",
            "咖哩飯加點_Add_On",
          ],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "炸魚_(2_塊)_Fried_Fish_",
        external_data: "XF11",
        title: {
          translations: {
            en: "炸魚 (2 塊) Fried Fish (2 Pieces)",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 8000,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              price: 8000,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "菠菜咖哩烏龍麵_Curry_Udon_w",
        external_data: "XA252",
        title: {
          translations: {
            en: "菠菜咖哩烏龍麵 Curry Udon with Spinach",
          },
        },
        description: {
          translations: {
            en: "含主餐及附餐。圖片僅供參考, 餐點以實物為準。",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/8264f27afe7efda667bb0474d6c157ff/a1681d67ebe55c76c3af5f401619c278.jpeg",
        price_info: {
          price: 33800,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        suspension_info: {
          overrides: [],
        },
        modifier_group_ids: {
          ids: ["附餐選擇_Choose_Side_Dis", "咖哩飯加點_Add_On"],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "炸雞塊咖哩拉麵_Ramen_with_D",
        external_data: "XA204",
        title: {
          translations: {
            en: "炸雞塊咖哩拉麵 Ramen with Deep-Fried Chicken Thigh and Curry",
          },
        },
        description: {
          translations: {
            en: "含主餐及附餐。味噌絞肉豬肉來源: 台灣。餐點圖片僅供參考, 食材供應將依時令季節調整。圖片僅供參考, 餐點以實物為準。",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/b4b9a395183544b68221ffc1c70044a7/a1681d67ebe55c76c3af5f401619c278.jpeg",
        price_info: {
          price: 43100,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        suspension_info: {
          overrides: [],
        },
        modifier_group_ids: {
          ids: ["附餐選擇_Choose_Side_Dis", "拉麵配菜加購_Ramen_Add_On"],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED", "CAT_PREPARED_FOOD"],
            source: "DEFAULT",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "炸蝦_(1_尾)_Fried_Shrim",
        external_data: "XF40",
        title: {
          translations: {
            en: "炸蝦 (1 尾) Fried Shrimp (1 Pieces)",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 7000,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              price: 7000,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "青花椰菜_(3_個)_Broccoli_",
        external_data: "XF38",
        title: {
          translations: {
            en: "青花椰菜 (3 個) Broccoli (3 Pieces)",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 2500,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              price: 2500,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "牛肉_(牛肉來源:_美國)_Beef_(",
        external_data: "XF10",
        title: {
          translations: {
            en: "牛肉 (牛肉來源: 美國) Beef (Beef Source: American)",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 14000,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              price: 14000,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "炸豬排歐姆蛋咖哩飯_Omelet_Ric",
        external_data: "XA002",
        title: {
          translations: {
            en: "炸豬排歐姆蛋咖哩飯 Omelet Rice Curry with Pork Cutlet",
          },
        },
        description: {
          translations: {
            en: "固定飯量 200 克。含主餐及附餐。豬肉來源: 加拿大。圖片僅供參考, 餐點以實物為準。",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/b18d3751a75bac3b012b7734cbd7865e/a1681d67ebe55c76c3af5f401619c278.jpeg",
        price_info: {
          price: 43100,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        modifier_group_ids: {
          ids: [
            "辣度_Spicy_Level",
            "附餐選擇_Choose_Side_Dis",
            "咖哩醬加點_Curry_Sauce_Ad_88123",
            "咖哩飯加點_Add_On",
          ],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["CAT_PREPARED_FOOD", "TEMP_HEATED"],
            source: "MANUAL",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "炸雞塊_(5_塊)_Fried_Chic",
        external_data: "XF05",
        title: {
          translations: {
            en: "炸雞塊 (5 塊) Fried Chicken (5 Pieces)",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 8500,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              price: 8500,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "植物肉漢堡排_Plant-based_H",
        external_data: "XG10",
        title: {
          translations: {
            en: "植物肉漢堡排 Plant-based Hamburger",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 9000,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              price: 9000,
            },
          ],
        },
        quantity_info: {
          quantity: {},
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              quantity: {},
            },
          ],
        },
        suspension_info: {
          overrides: [],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED", "CAT_PREPARED_FOOD"],
            source: "DEFAULT",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "蝦仁_(5_隻)_Shirmp_(5_P",
        external_data: "XF39",
        title: {
          translations: {
            en: "蝦仁 (5 隻) Shirmp (5 Pieces)",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 6500,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              price: 6500,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "蝦仁咖哩飯_Stewed_Shrimp_",
        external_data: "XA008",
        title: {
          translations: {
            en: "蝦仁咖哩飯 Stewed Shrimp Curry",
          },
        },
        description: {
          translations: {
            en: "含主餐及附餐。圖片僅供參考, 餐點以實物為準。",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/e6088c3b32ec948d8797bbe4fe5b8db8/a1681d67ebe55c76c3af5f401619c278.jpeg",
        price_info: {
          price: 38200,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        modifier_group_ids: {
          ids: [
            "飯量選擇_Choose_Rice",
            "辣度_Spicy_Level",
            "附餐選擇_Choose_Side_Dis",
            "咖哩醬加點_Curry_Sauce_Ad_88123",
            "咖哩飯加點_Add_On",
          ],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED", "CAT_PREPARED_FOOD"],
            source: "DEFAULT",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "蕃茄青花椰菜_Tomato_and_Br",
        external_data: "XF28",
        title: {
          translations: {
            en: "蕃茄青花椰菜 Tomato and Broccoli",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 6500,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              price: 6500,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED", "CAT_PREPARED_FOOD"],
            source: "DEFAULT",
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "炸雞塊咖哩飯_Fried_Chicken",
        external_data: "XA004",
        title: {
          translations: {
            en: "炸雞塊咖哩飯 Fried Chicken Thigh  Curry",
          },
        },
        description: {
          translations: {
            en: "含主餐及附餐。圖片僅供參考, 餐點以實物為準。",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/30672d6dc509fde206b796f3d4e67b4e/a1681d67ebe55c76c3af5f401619c278.jpeg",
        price_info: {
          price: 33800,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        modifier_group_ids: {
          ids: [
            "飯量選擇_Choose_Rice",
            "辣度_Spicy_Level",
            "附餐選擇_Choose_Side_Dis",
            "咖哩醬加點_Curry_Sauce_Ad_88123",
            "咖哩飯加點_Add_On",
          ],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["CAT_PREPARED_FOOD", "TEMP_HEATED"],
            source: "MANUAL",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "起士_(奶素可選)_Cheese_(La",
        external_data: "XF24",
        title: {
          translations: {
            en: "起士 (奶素可選) Cheese (Lacto Vegetarian)",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 5000,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              price: 5000,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "舒植肉丸_(純素)_Plant-base",
        external_data: "XG13",
        title: {
          translations: {
            en: "舒植肉丸 (純素) Plant-based Meatballs",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 6000,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              price: 6000,
            },
          ],
        },
        quantity_info: {
          quantity: {},
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              quantity: {},
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "炸豬排咖哩烏龍麵_Curry_Udon_",
        external_data: "XA251",
        title: {
          translations: {
            en: "炸豬排咖哩烏龍麵 Curry Udon with Pork Cutlet",
          },
        },
        description: {
          translations: {
            en: "含主餐及附餐。炸豬排豬肉來源：加拿大。餐點圖片僅供參考, 食材供應將依時令季節調整。圖片僅供參考, 餐點以實物為準。",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/e32e81b29593b9b4af98d89749b01ccb/a1681d67ebe55c76c3af5f401619c278.jpeg",
        price_info: {
          price: 43100,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        suspension_info: {
          overrides: [],
        },
        modifier_group_ids: {
          ids: ["附餐選擇_Choose_Side_Dis", "咖哩飯加點_Add_On"],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "飲料_Beverage",
        external_data: "",
        title: {
          translations: {
            en: "飲料 Beverage",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 0,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "附餐選擇_Choose_Side_Dis",
              price: 0,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "附餐選項_Choose_Side_Dis",
              price: 0,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "附餐選擇_Choose_Side_Dis_40352",
              price: 0,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "附餐選擇_Choose_Side_Dis",
              quantity: {
                max_permitted: 1,
              },
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "附餐選項_Choose_Side_Dis",
              quantity: {
                max_permitted: 1,
              },
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "附餐選擇_Choose_Side_Dis_40352",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: ["飲品選擇_Choose_Beverage"],
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "附餐選擇_Choose_Side_Dis",
              ids: ["飲品選擇_Choose_Beverage"],
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "附餐選項_Choose_Side_Dis",
              ids: ["飲品選擇_Choose_Beverage"],
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "附餐選擇_Choose_Side_Dis_40352",
              ids: ["飲品選擇_Choose_Beverage"],
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "冰可樂_Iced_Coke",
        external_data: "XA09",
        title: {
          translations: {
            en: "冰可樂 Iced Coke",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 0,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飲品選擇_Choose_Beverage",
              price: 0,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飲品選擇_Choose_Beverage",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飲品選擇_Choose_Beverage",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED", "CAT_PREPARED_FOOD"],
            source: "DEFAULT",
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "芝麻醬小沙拉_Small_Salad_w",
        external_data: "XA02",
        title: {
          translations: {
            en: "芝麻醬小沙拉 Small Salad with Sesame Sauce",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 0,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "附餐選擇_Choose_Side_Dis_40352",
              price: 0,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "附餐選擇_Choose_Side_Dis",
              price: 0,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "附餐選擇_Choose_Side_Dis_40352",
              quantity: {
                max_permitted: 1,
              },
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "附餐選擇_Choose_Side_Dis",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        suspension_info: {
          suspension: {
            suspend_until: 8640000000,
          },
          overrides: [],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "附餐選擇_Choose_Side_Dis_40352",
              ids: null,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "附餐選擇_Choose_Side_Dis",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED", "CAT_PREPARED_FOOD"],
            source: "DEFAULT",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "菠菜_Spinach_87114",
        external_data: "XF18",
        title: {
          translations: {
            en: "菠菜 Spinach",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 4000,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              price: 4000,
            },
          ],
        },
        quantity_info: {
          quantity: {},
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              quantity: {},
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "藜麥毛豆_Quinoa_Edamame",
        external_data: "XG09",
        title: {
          translations: {
            en: "藜麥毛豆 Quinoa Edamame",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 8000,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              price: 8000,
            },
          ],
        },
        quantity_info: {
          quantity: {},
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              quantity: {},
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED", "CAT_PREPARED_FOOD"],
            source: "DEFAULT",
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "300_克_300_g",
        external_data: "XC01",
        title: {
          translations: {
            en: "300 克 300 g",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 1000,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飯量選擇_Choose_Rice",
              price: 1000,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飯量選擇_Choose_Rice",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飯量選擇_Choose_Rice",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "炸豬排_(豬肉來源:加拿大及台灣)_Po",
        external_data: "XF09",
        title: {
          translations: {
            en: "炸豬排 (豬肉來源:加拿大及台灣) Pork Cutlet (Pork Source: Canada and Taiwan)",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 12500,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              price: 12500,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "歐姆蛋炸蝦咖哩飯_Omelet_Rice",
        external_data: "XA024",
        title: {
          translations: {
            en: "歐姆蛋炸蝦咖哩飯 Omelet Rice Curry with Fried Shrimp",
          },
        },
        description: {
          translations: {
            en: "固定飯量 200 克。含主餐及附餐。圖片僅供參考, 餐點以實物為準。",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/682aa08c2b9f95524dc6e92efc323324/a1681d67ebe55c76c3af5f401619c278.jpeg",
        price_info: {
          price: 44200,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        modifier_group_ids: {
          ids: [
            "辣度_Spicy_Level",
            "附餐選擇_Choose_Side_Dis",
            "咖哩醬加點_Curry_Sauce_Ad_88123",
            "咖哩飯加點_Add_On",
          ],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "炸雞塊歐姆蛋咖哩飯_Omelet_Cur",
        external_data: "XA001",
        title: {
          translations: {
            en: "炸雞塊歐姆蛋咖哩飯 Omelet Curry Rice with  Fried Chicken Thigh",
          },
        },
        description: {
          translations: {
            en: "固定飯量 200 克。含主餐及附餐。圖片僅供參考, 餐點以實物為準。",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/0dc182da8af6096fd620bc5d7f5dcbc0/a1681d67ebe55c76c3af5f401619c278.jpeg",
        price_info: {
          price: 38700,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        modifier_group_ids: {
          ids: [
            "辣度_Spicy_Level",
            "附餐選擇_Choose_Side_Dis",
            "咖哩醬加點_Curry_Sauce_Ad_88123",
            "咖哩飯加點_Add_On",
          ],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED", "CAT_PREPARED_FOOD"],
            source: "DEFAULT",
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "綜合菇_Assorted_Mushroo",
        external_data: "XF22",
        title: {
          translations: {
            en: "綜合菇 Assorted Mushroom",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 7000,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              price: 7000,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "U_炸豬排歐姆蛋咖哩飯_U_Omelet",
        external_data: "XA801",
        title: {
          translations: {
            en: "U 炸豬排歐姆蛋咖哩飯 U Omelet Rice Curry with Pork Cutlet",
          },
        },
        description: {
          translations: {
            en: "固定飯量 200克。含主餐及柳橙汁一杯。豬肉來源:  加拿大及台灣。圖片僅供參考, 餐點以實物為準。",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/43dc3ce2e06a6c589c695a136df2f023/c67fc65e9b4e16a553eb7574fba090f1.jpeg",
        price_info: {
          price: 37500,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        suspension_info: {
          suspension: {
            suspend_until: 8640000000,
          },
          overrides: [],
        },
        modifier_group_ids: {
          ids: ["辣度_Spicy_Level", "飲料_Beverage_42148"],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "咖哩醬加點_Curry_Sauce_Ad",
        external_data: "XH01",
        title: {
          translations: {
            en: "咖哩醬加點 Curry Sauce Add On",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 4000,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩醬加點_Curry_Sauce_Ad_88123",
              price: 4000,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩醬加點_Curry_Sauce_Ad_88123",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩醬加點_Curry_Sauce_Ad_88123",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "燉雞肉_Stewed_Chicken",
        external_data: "XF31",
        title: {
          translations: {
            en: "燉雞肉 Stewed Chicken",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 8000,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              price: 8000,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "炸蝦咖哩飯_Fried_Shrimp_C",
        external_data: "XA028",
        title: {
          translations: {
            en: "炸蝦咖哩飯 Fried Shrimp Curry",
          },
        },
        description: {
          translations: {
            en: "含主餐及附餐。圖片僅供參考, 餐點以實物為準。",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/949b250e8e8ed745cefa27a3cce4a409/a1681d67ebe55c76c3af5f401619c278.jpeg",
        price_info: {
          price: 39300,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        modifier_group_ids: {
          ids: [
            "飯量選擇_Choose_Rice",
            "辣度_Spicy_Level",
            "附餐選擇_Choose_Side_Dis",
            "咖哩醬加點_Curry_Sauce_Ad_88123",
            "咖哩飯加點_Add_On",
          ],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "起士_(H)(奶素可選)_Cheese_",
        external_data: "XF35",
        title: {
          translations: {
            en: "起士 (H)(奶素可選) Cheese (H)(Lacto Vegetarian)",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 3000,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              price: 3000,
            },
          ],
        },
        quantity_info: {
          quantity: {},
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              quantity: {},
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食配菜加購_Vegetarian_Ad",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "涮豬肉_(豬肉來源:_巴拉圭,_西班牙)",
        external_data: "XF03",
        title: {
          translations: {
            en: "涮豬肉 (豬肉來源: 巴拉圭, 西班牙) Pork SHABU (Pork Source: Spain, Paraguay)",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 7500,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              price: 7500,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "炸雞塊_(3_塊)_Fried_Chic",
        external_data: "XF33",
        title: {
          translations: {
            en: "炸雞塊 (3 塊) Fried Chicken (3 Pieces)",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 5000,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              price: 5000,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "炸豬排蔬菜歐姆蛋咖哩飯_Omelet_R",
        external_data: "XA018",
        title: {
          translations: {
            en: "炸豬排蔬菜歐姆蛋咖哩飯 Omelet Rice Pork Cutlet Curry with Vegetable",
          },
        },
        description: {
          translations: {
            en: "固定飯量 200 克。含主餐及附餐。豬肉來源: 加拿大。圖片僅供參考, 餐點以實物為準。",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/6df36f9b81209096fdf13f45f4b55c8b/a1681d67ebe55c76c3af5f401619c278.jpeg",
        price_info: {
          price: 51400,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        modifier_group_ids: {
          ids: [
            "辣度_Spicy_Level",
            "附餐選擇_Choose_Side_Dis",
            "咖哩醬加點_Curry_Sauce_Ad_88123",
            "咖哩飯加點_Add_On",
          ],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "熱紅茶_Hot_Black_Tea",
        external_data: "XA06",
        title: {
          translations: {
            en: "熱紅茶 Hot Black Tea",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 0,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飲品選擇_Choose_Beverage",
              price: 0,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飲品選擇_Choose_Beverage",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飲品選擇_Choose_Beverage",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["TEMP_HEATED", "CAT_PREPARED_FOOD"],
            source: "DEFAULT",
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "冰柳橙汁_Iced_Orange_Jui",
        external_data: "XZ01",
        title: {
          translations: {
            en: "冰柳橙汁 Iced Orange Juice",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 0,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飲料_Beverage_42148",
              price: 0,
            },
          ],
        },
        quantity_info: {
          quantity: {},
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飲料_Beverage_42148",
              quantity: {},
            },
          ],
        },
        suspension_info: {
          suspension: {
            suspend_until: 1767384000,
          },
          overrides: [],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飲料_Beverage_42148",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: [],
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "炸魚_(1_塊)_Fried_Fish_",
        external_data: "XF34",
        title: {
          translations: {
            en: "炸魚 (1 塊) Fried Fish (1 Pieces)",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 4500,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              price: 4500,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "甘口_(不辣)_Non-Spicy",
        external_data: "XD01",
        title: {
          translations: {
            en: "甘口 (不辣) Non-Spicy",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 0,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "辣度_Spicy_Level",
              price: 0,
            },
          ],
        },
        quantity_info: {
          quantity: {},
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "辣度_Spicy_Level",
              quantity: {},
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "辣度_Spicy_Level",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "秋葵豆腐咖哩飯_Okra_Tofu_Cu",
        external_data: "XA032",
        title: {
          translations: {
            en: "秋葵豆腐咖哩飯 Okra Tofu Curry",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/fcfde9e70ba887991729e2984d754267/a1681d67ebe55c76c3af5f401619c278.jpeg",
        price_info: {
          price: 29400,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        modifier_group_ids: {
          ids: [
            "飯量選擇_Choose_Rice",
            "辣度_Spicy_Level",
            "附餐選擇_Choose_Side_Dis",
            "咖哩飯加點_Add_On",
            "咖哩醬加點_Curry_Sauce_Ad_88123",
          ],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "炸雞排_Fried_Chicken_Cu",
        external_data: "XF06",
        title: {
          translations: {
            en: "炸雞排 Fried Chicken Cutlet",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 8500,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              price: 8500,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "500_克_500_g",
        external_data: "XC03",
        title: {
          translations: {
            en: "500 克 500 g",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 7000,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飯量選擇_Choose_Rice",
              price: 7000,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飯量選擇_Choose_Rice",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飯量選擇_Choose_Rice",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "菠菜咖哩飯_Spinach_Curry",
        external_data: "XA009",
        title: {
          translations: {
            en: "菠菜咖哩飯 Spinach Curry",
          },
        },
        description: {
          translations: {
            en: "含主餐及附餐。圖片僅供參考, 餐點以實物為準。",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/464ffe6affdf61e64253a95a2b6a39ce/a1681d67ebe55c76c3af5f401619c278.jpeg",
        price_info: {
          price: 28800,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        modifier_group_ids: {
          ids: [
            "飯量選擇_Choose_Rice",
            "辣度_Spicy_Level",
            "附餐選擇_Choose_Side_Dis",
            "咖哩醬加點_Curry_Sauce_Ad_88123",
            "咖哩飯加點_Add_On",
          ],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        tax_label_info: {
          default_value: {
            labels: ["CAT_PREPARED_FOOD", "TEMP_HEATED"],
            source: "MANUAL",
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "和風醬小沙拉_Small_Salad_w",
        external_data: "XA01",
        title: {
          translations: {
            en: "和風醬小沙拉 Small Salad with Japanese Dressing",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 0,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "附餐選擇_Choose_Side_Dis",
              price: 0,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "附餐選項_Choose_Side_Dis",
              price: 0,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "附餐選擇_Choose_Side_Dis",
              quantity: {
                max_permitted: 1,
              },
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "附餐選項_Choose_Side_Dis",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        suspension_info: {
          suspension: {
            suspend_until: 1782244800,
          },
          overrides: [],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "附餐選擇_Choose_Side_Dis",
              ids: null,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "附餐選項_Choose_Side_Dis",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "350_克_350_g",
        external_data: "XC05",
        title: {
          translations: {
            en: "350 克 350 g",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 3000,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飯量選擇_Choose_Rice",
              price: 3000,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飯量選擇_Choose_Rice",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飯量選擇_Choose_Rice",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "(H)_茄子_(H)_炸雞塊及蕃茄青花椰",
        external_data: "XA023",
        title: {
          translations: {
            en: "(H) 茄子 (H) 炸雞塊及蕃茄青花椰菜咖哩飯 Tomato and Broccoli Curry with Half Eggplant and Half Fried Chicken",
          },
        },
        description: {
          translations: {
            en: "含主餐及附餐。含香茄 3 個及炸雞塊 3 個。圖片僅供參考, 餐點以實物為準。",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/197a0f804eee435b79980d523b3d41da/a1681d67ebe55c76c3af5f401619c278.jpeg",
        price_info: {
          price: 39800,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        modifier_group_ids: {
          ids: [
            "飯量選擇_Choose_Rice",
            "辣度_Spicy_Level",
            "附餐選擇_Choose_Side_Dis",
            "咖哩醬加點_Curry_Sauce_Ad_88123",
            "咖哩飯加點_Add_On",
          ],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "玉米可樂餅(1塊)_Corn_Croqu",
        external_data: "XF47",
        title: {
          translations: {
            en: "玉米可樂餅(1塊) Corn Croquette",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 5500,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              price: 5500,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "3_辛_(大辣)_Extra_Spicy",
        external_data: "XD05",
        title: {
          translations: {
            en: "3 辛 (大辣) Extra Spicy",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 0,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "辣度_Spicy_Level",
              price: 0,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食辣度選擇_Vegetarian_Sp",
              price: 0,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "麻婆辣度選擇_Mabo_Spicy_Le",
              price: 0,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食辣度選擇_Vegetarian_Sp_59537",
              price: 0,
            },
          ],
        },
        quantity_info: {
          quantity: {},
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "辣度_Spicy_Level",
              quantity: {},
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食辣度選擇_Vegetarian_Sp",
              quantity: {
                max_permitted: 1,
              },
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "麻婆辣度選擇_Mabo_Spicy_Le",
              quantity: {
                max_permitted: 1,
              },
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食辣度選擇_Vegetarian_Sp_59537",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "辣度_Spicy_Level",
              ids: null,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食辣度選擇_Vegetarian_Sp",
              ids: null,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "麻婆辣度選擇_Mabo_Spicy_Le",
              ids: null,
            },
            {
              context_type: "MODIFIER_GROUP",
              context_value: "素食辣度選擇_Vegetarian_Sp_59537",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "漢堡_(牛肉來源:_紐西蘭,_豬肉來源:",
        external_data: "XF08",
        title: {
          translations: {
            en: "漢堡 (牛肉來源: 紐西蘭, 豬肉來源: 台灣) Burger (Beef Source: New Zealand, Pork Source: Taiwan)",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 9500,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              price: 9500,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "600_克_600_g",
        external_data: "XC04",
        title: {
          translations: {
            en: "600 克 600 g",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 10000,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飯量選擇_Choose_Rice",
              price: 10000,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飯量選擇_Choose_Rice",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "飯量選擇_Choose_Rice",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "菠菜_Spinach",
        external_data: "XF18",
        title: {
          translations: {
            en: "菠菜 Spinach",
          },
        },
        description: {
          translations: {
            en: "",
          },
        },
        image_url: "",
        price_info: {
          price: 4000,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              price: 4000,
            },
          ],
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              quantity: {
                max_permitted: 1,
              },
            },
          ],
        },
        modifier_group_ids: {
          ids: null,
          overrides: [
            {
              context_type: "MODIFIER_GROUP",
              context_value: "咖哩飯加點_Add_On",
              ids: null,
            },
          ],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            can_serve_alone: false,
            alcoholic_items: 0,
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
      {
        id: "香脆雞腿排咖哩拉麵_Lightly_Cr",
        external_data: "XA206",
        title: {
          translations: {
            en: "香脆雞腿排咖哩拉麵 Lightly Crisped Chicken Curry Ramen with Miso Ground Meat",
          },
        },
        description: {
          translations: {
            en: "含主餐及附餐。味噌絞肉豬肉來源: 台灣。餐點圖片僅供參考, 食材供應將依時令季節調整。圖片僅供參考, 餐點以實物為準。",
          },
        },
        image_url:
          "https://tb-static.uber.com/prod/image-proc/processed_images/0737e1e66c47b83fbfcecfa4e18159a2/a1681d67ebe55c76c3af5f401619c278.jpeg",
        price_info: {
          price: 43100,
          overrides: [],
        },
        quantity_info: {
          quantity: {},
          overrides: [],
        },
        modifier_group_ids: {
          ids: ["附餐選擇_Choose_Side_Dis", "拉麵配菜加購_Ramen_Add_On"],
          overrides: [],
        },
        tax_info: {},
        nutritional_info: {
          allergens: null,
        },
        dish_info: {
          classifications: {
            ingredients: null,
            additives: null,
          },
        },
        product_info: {
          product_traits: null,
          countries_of_origin: null,
        },
        bundled_items: null,
      },
    ],
    modifier_groups: [
      {
        id: "飲料_Beverage_42148",
        external_data: "",
        title: {
          translations: {
            en: "飲料 Beverage",
          },
        },
        quantity_info: {
          quantity: {
            min_permitted: 1,
            max_permitted: 1,
          },
          overrides: [],
        },
        modifier_options: [
          {
            id: "冰柳橙汁_Iced_Orange_Jui",
            type: "ITEM",
          },
        ],
      },
      {
        id: "咖哩飯加點_Add_On",
        external_data: "",
        title: {
          translations: {
            en: "咖哩飯加點 Add On",
          },
        },
        quantity_info: {
          quantity: {
            max_permitted: 38,
          },
          overrides: [],
        },
        modifier_options: [
          {
            id: "青花椰菜_Broccoli",
            type: "ITEM",
          },
          {
            id: "涮豬肉_(豬肉來源:_巴拉圭,_西班牙)",
            type: "ITEM",
          },
          {
            id: "涮牛肉_(牛肉來源:美國)_Beef_S",
            type: "ITEM",
          },
          {
            id: "炸雞塊_(5_塊)_Fried_Chic",
            type: "ITEM",
          },
          {
            id: "炸雞排_Fried_Chicken_Cu",
            type: "ITEM",
          },
          {
            id: "漢堡_(牛肉來源:_紐西蘭,_豬肉來源:",
            type: "ITEM",
          },
          {
            id: "炸豬排_(豬肉來源:加拿大及台灣)_Po",
            type: "ITEM",
          },
          {
            id: "牛肉_(牛肉來源:_美國)_Beef_(",
            type: "ITEM",
          },
          {
            id: "炸魚_(2_塊)_Fried_Fish_",
            type: "ITEM",
          },
          {
            id: "蝦仁_Shirmp",
            type: "ITEM",
          },
          {
            id: "炸蝦_(2_尾)_Fried_Shrim",
            type: "ITEM",
          },
          {
            id: "海鮮_Seafood",
            type: "ITEM",
          },
          {
            id: "玉米_Corn",
            type: "ITEM",
          },
          {
            id: "菠菜_Spinach",
            type: "ITEM",
          },
          {
            id: "茄子_(6_塊)_Eggplant_(6",
            type: "ITEM",
          },
          {
            id: "蕃茄青花椰菜_Tomato_and_Br",
            type: "ITEM",
          },
          {
            id: "蔬菜_Vegetable",
            type: "ITEM",
          },
          {
            id: "綜合菇_Assorted_Mushroo",
            type: "ITEM",
          },
          {
            id: "水煮蛋_(蛋素可選)_Hard_Boil",
            type: "ITEM",
          },
          {
            id: "起士_(奶素可選)_Cheese_(La",
            type: "ITEM",
          },
          {
            id: "起士條_(3_條)_Cheese_Sti",
            type: "ITEM",
          },
          {
            id: "燉雞肉_Stewed_Chicken",
            type: "ITEM",
          },
          {
            id: "茄子_(3_塊)_Eggplant_(3",
            type: "ITEM",
          },
          {
            id: "炸雞塊_(3_塊)_Fried_Chic",
            type: "ITEM",
          },
          {
            id: "炸魚_(1_塊)_Fried_Fish_",
            type: "ITEM",
          },
          {
            id: "起士_(H)_(蛋素可選)_Half_C",
            type: "ITEM",
          },
          {
            id: "起士條_(2_條)_Fried_Chee",
            type: "ITEM",
          },
          {
            id: "青花椰菜_(3_個)_Broccoli_",
            type: "ITEM",
          },
          {
            id: "蝦仁_(5_隻)_Shirmp_(5_P",
            type: "ITEM",
          },
          {
            id: "炸蝦_(1_尾)_Fried_Shrim",
            type: "ITEM",
          },
          {
            id: "白花椰菜_Cauliflower",
            type: "ITEM",
          },
          {
            id: "白花椰菜(3個)_Cauliflower",
            type: "ITEM",
          },
          {
            id: "秋葵豆腐_Okra_Tofu",
            type: "ITEM",
          },
          {
            id: "馬鈴薯_Potato",
            type: "ITEM",
          },
          {
            id: "玉米筍_Baby_Corn",
            type: "ITEM",
          },
          {
            id: "香脆雞腿排_Crispy_Chicken",
            type: "ITEM",
          },
          {
            id: "玉米可樂餅(1塊)_Corn_Croqu",
            type: "ITEM",
          },
          {
            id: "玉米可樂餅(2塊)",
            type: "ITEM",
          },
        ],
      },
      {
        id: "辣度_Spicy_Level",
        external_data: "",
        title: {
          translations: {
            en: "辣度 Spicy Level",
          },
        },
        quantity_info: {
          quantity: {
            min_permitted: 1,
            max_permitted: 1,
          },
          overrides: [],
        },
        modifier_options: [
          {
            id: "甘口_(不辣)_Non-Spicy",
            type: "ITEM",
          },
          {
            id: "普通_(標準)_Regular_Spic",
            type: "ITEM",
          },
          {
            id: "1_辛_(小辣)_Medium_Spic",
            type: "ITEM",
          },
          {
            id: "2_辛_(中辣)_Spicy",
            type: "ITEM",
          },
          {
            id: "3_辛_(大辣)_Extra_Spicy",
            type: "ITEM",
          },
          {
            id: "4_辛_(重辣)_Super_Spicy",
            type: "ITEM",
          },
          {
            id: "5_辛_(超辣)_Crazy_Spicy",
            type: "ITEM",
          },
          {
            id: "10_辛_(無限辣)_Death_Spi",
            type: "ITEM",
          },
        ],
      },
      {
        id: "附餐選擇_Choose_Side_Dis_40352",
        external_data: "",
        title: {
          translations: {
            en: "附餐選擇 Choose Side Dish",
          },
        },
        quantity_info: {
          quantity: {
            min_permitted: 1,
            max_permitted: 1,
          },
          overrides: [],
        },
        modifier_options: [
          {
            id: "芝麻醬小沙拉_Small_Salad_w",
            type: "ITEM",
          },
          {
            id: "例湯_Soup",
            type: "ITEM",
          },
          {
            id: "飲料_Beverage",
            type: "ITEM",
          },
        ],
      },
      {
        id: "麻婆辣度選擇_Mabo_Spicy_Le",
        external_data: "",
        title: {
          translations: {
            en: "麻婆辣度選擇 Mabo Spicy Level",
          },
        },
        quantity_info: {
          quantity: {
            min_permitted: 1,
            max_permitted: 1,
          },
          overrides: [],
        },
        modifier_options: [
          {
            id: "普通_(微辣)_Standard_Spi",
            type: "ITEM",
          },
          {
            id: "1_辛_(小辣)_Medium_Spic",
            type: "ITEM",
          },
          {
            id: "2_辛_(中辣)_Spicy",
            type: "ITEM",
          },
          {
            id: "3_辛_(大辣)_Extra_Spicy",
            type: "ITEM",
          },
          {
            id: "4_辛_(重辣)_Super_Spicy",
            type: "ITEM",
          },
          {
            id: "5_辛_(超辣)_Crazy_Spicy",
            type: "ITEM",
          },
          {
            id: "10_辛_(無限辣)_Death_Spi",
            type: "ITEM",
          },
        ],
      },
      {
        id: "咖哩醬加點_Curry_Sauce_Ad_88123",
        external_data: "",
        title: {
          translations: {
            en: "咖哩醬加點 Curry Sauce Add On",
          },
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [],
        },
        modifier_options: [
          {
            id: "咖哩醬加點_Curry_Sauce_Ad",
            type: "ITEM",
          },
        ],
      },
      {
        id: "飲品選擇_Choose_Beverage",
        external_data: "",
        title: {
          translations: {
            en: "飲品選擇 Choose Beverage",
          },
        },
        quantity_info: {
          quantity: {
            min_permitted: 1,
            max_permitted: 1,
          },
          overrides: [],
        },
        modifier_options: [
          {
            id: "水蜜桃紅茶_Peach_Black_Te",
            type: "ITEM",
          },
          {
            id: "熱咖啡_Hot_Coffee",
            type: "ITEM",
          },
          {
            id: "冰咖啡_Iced_Coffee",
            type: "ITEM",
          },
          {
            id: "熱紅茶_Hot_Black_Tea",
            type: "ITEM",
          },
          {
            id: "冰紅茶_Iced_Black_Tea",
            type: "ITEM",
          },
          {
            id: "冰烏龍茶_Iced_Oolong_Tea",
            type: "ITEM",
          },
          {
            id: "冰可樂_Iced_Coke",
            type: "ITEM",
          },
          {
            id: "冰雪碧_Iced_Sprite",
            type: "ITEM",
          },
          {
            id: "冰柳橙汁_Iced_Orange_Jui_97347",
            type: "ITEM",
          },
          {
            id: "無咖啡茶_Hot_Non-Caffein",
            type: "ITEM",
          },
          {
            id: "熱日本茶_Hot_Japanese_Te",
            type: "ITEM",
          },
        ],
      },
      {
        id: "素食咖哩醬加購_Vegetarian_C",
        external_data: "",
        title: {
          translations: {
            en: "素食咖哩醬加購 Vegetarian Curry Sauce Add On",
          },
        },
        quantity_info: {
          quantity: {
            max_permitted: 1,
          },
          overrides: [],
        },
        modifier_options: [
          {
            id: "素食咖哩醬加量_Extra_Vegeta",
            type: "ITEM",
          },
        ],
      },
      {
        id: "素食辣度選擇_Vegetarian_Sp",
        external_data: "",
        title: {
          translations: {
            en: "素食辣度選擇 Vegetarian Spicy Level",
          },
        },
        quantity_info: {
          quantity: {
            min_permitted: 1,
            max_permitted: 1,
          },
          overrides: [],
        },
        modifier_options: [
          {
            id: "普通_(標準)_Regular_Spic",
            type: "ITEM",
          },
          {
            id: "1_辛_(小辣)_Medium_Spic",
            type: "ITEM",
          },
          {
            id: "2_辛_(中辣)_Spicy",
            type: "ITEM",
          },
          {
            id: "3_辛_(大辣)_Extra_Spicy",
            type: "ITEM",
          },
          {
            id: "4_辛_(重辣)_Super_Spicy",
            type: "ITEM",
          },
          {
            id: "5_辛_(超辣)_Crazy_Spicy",
            type: "ITEM",
          },
          {
            id: "10_辛_(無限辣)_Death_Spi",
            type: "ITEM",
          },
        ],
      },
      {
        id: "飯量選擇_Choose_Rice",
        external_data: "",
        title: {
          translations: {
            en: "飯量選擇 Choose Rice",
          },
        },
        quantity_info: {
          quantity: {
            min_permitted: 1,
            max_permitted: 1,
          },
          overrides: [],
        },
        modifier_options: [
          {
            id: "250_克(標準)_250g(Stand",
            type: "ITEM",
          },
          {
            id: "300_克_300_g",
            type: "ITEM",
          },
          {
            id: "350_克_350_g",
            type: "ITEM",
          },
          {
            id: "400_克_400_g",
            type: "ITEM",
          },
          {
            id: "500_克_500_g",
            type: "ITEM",
          },
          {
            id: "600_克_600_g",
            type: "ITEM",
          },
        ],
      },
      {
        id: "素食配菜加購_Vegetarian_Ad",
        external_data: "",
        title: {
          translations: {
            en: "素食配菜加購 Vegetarian Add On",
          },
        },
        quantity_info: {
          quantity: {
            max_permitted: 18,
          },
          overrides: [],
        },
        modifier_options: [
          {
            id: "青花椰菜_Broccoli",
            type: "ITEM",
          },
          {
            id: "藜麥毛豆_Quinoa_Edamame",
            type: "ITEM",
          },
          {
            id: "植物肉漢堡排_Plant-based_H",
            type: "ITEM",
          },
          {
            id: "玉米_Corn_82690",
            type: "ITEM",
          },
          {
            id: "菠菜_Spinach_87114",
            type: "ITEM",
          },
          {
            id: "蕃茄青花椰菜_Tomato_and_Br_91789",
            type: "ITEM",
          },
          {
            id: "蔬菜_Vegetable_62164",
            type: "ITEM",
          },
          {
            id: "綜合菇_Assorted_Mushroo_01384",
            type: "ITEM",
          },
          {
            id: "水煮蛋_(蛋素可選)_Hard_Boil_46128",
            type: "ITEM",
          },
          {
            id: "起士_(奶素可選)_Cheese_(La_79818",
            type: "ITEM",
          },
          {
            id: "起士_(H)(奶素可選)_Cheese_",
            type: "ITEM",
          },
          {
            id: "青花椰菜_(3_個)_Broccoli__97853",
            type: "ITEM",
          },
          {
            id: "舒植肉丸_(純素)_Plant-base",
            type: "ITEM",
          },
          {
            id: "白花椰菜_Cauliflower",
            type: "ITEM",
          },
          {
            id: "白花椰菜(3_個)_Cauliflowe",
            type: "ITEM",
          },
          {
            id: "秋葵豆腐_Okra_Tofu",
            type: "ITEM",
          },
          {
            id: "馬鈴薯_Potato",
            type: "ITEM",
          },
          {
            id: "玉米筍_Baby_Corn",
            type: "ITEM",
          },
        ],
      },
      {
        id: "附餐選擇_Choose_Side_Dis",
        external_data: "",
        title: {
          translations: {
            en: "附餐選擇 Choose Side Dish",
          },
        },
        quantity_info: {
          quantity: {
            min_permitted: 1,
            max_permitted: 1,
          },
          overrides: [],
        },
        modifier_options: [
          {
            id: "和風醬小沙拉_Small_Salad_w",
            type: "ITEM",
          },
          {
            id: "芝麻醬小沙拉_Small_Salad_w",
            type: "ITEM",
          },
          {
            id: "例湯_Soup",
            type: "ITEM",
          },
          {
            id: "飲料_Beverage",
            type: "ITEM",
          },
        ],
      },
      {
        id: "附餐選項_Choose_Side_Dis",
        external_data: "",
        title: {
          translations: {
            en: "附餐選項 Choose Side Dish",
          },
        },
        quantity_info: {
          quantity: {
            min_permitted: 1,
            max_permitted: 1,
          },
          overrides: [],
        },
        modifier_options: [
          {
            id: "和風醬小沙拉_Small_Salad_w",
            type: "ITEM",
          },
          {
            id: "飲料_Beverage",
            type: "ITEM",
          },
        ],
      },
      {
        id: "拉麵配菜加購_Ramen_Add_On",
        external_data: "",
        title: {
          translations: {
            en: "拉麵配菜加購 Ramen Add On",
          },
        },
        quantity_info: {
          quantity: {
            max_permitted: 3,
          },
          overrides: [],
        },
        modifier_options: [
          {
            id: "玉米_Corn",
            type: "ITEM",
          },
          {
            id: "起士_Cheese",
            type: "ITEM",
          },
          {
            id: "白飯_Rice",
            type: "ITEM",
          },
        ],
      },
      {
        id: "素食辣度選擇_Vegetarian_Sp_59537",
        external_data: "",
        title: {
          translations: {
            en: "素食辣度選擇 Vegetarian Spicy Level",
          },
        },
        quantity_info: {
          quantity: {
            min_permitted: 1,
            max_permitted: 1,
          },
          overrides: [],
        },
        modifier_options: [
          {
            id: "普通_(微辣)_Standard_Spi",
            type: "ITEM",
          },
          {
            id: "1_辛_(小辣)_Medium_Spic",
            type: "ITEM",
          },
          {
            id: "2_辛_(中辣)_Spicy",
            type: "ITEM",
          },
          {
            id: "3_辛_(大辣)_Extra_Spicy",
            type: "ITEM",
          },
          {
            id: "4_辛_(重辣)_Super_Spicy",
            type: "ITEM",
          },
          {
            id: "5_辛_(超辣)_Crazy_Spicy",
            type: "ITEM",
          },
          {
            id: "10_辛_(無限辣)_Death_Spi",
            type: "ITEM",
          },
        ],
      },
    ],
  },
  test: {},
};
