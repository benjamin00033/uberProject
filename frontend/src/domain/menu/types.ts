export interface Translation {
  en?: string;
  [key: string]: string | undefined;
}

export interface Title {
  translations: Translation;
}

export interface Description {
  translations: Translation;
}

export interface TimePeriod {
  start_time: string;
  end_time: string;
}

export interface ServiceAvailability {
  day_of_week: string;
  time_periods: TimePeriod[];
}

export interface Menu {
  id: string;
  title: Title;
  service_availability: ServiceAvailability[];
  category_ids: string[];
}

export interface Entity {
  id: string;
  type: string;
}

export interface Category {
  id: string;
  title: Title;
  entities: Entity[];
}

export interface PriceOverride {
  context_type: string;
  context_value: string;
  price: number;
}

export interface PriceInfo {
  price: number;
  overrides?: PriceOverride[];
}

export interface Quantity {
  max_permitted?: number;
  [key: string]: any;
}

export interface QuantityOverride {
  context_type: string;
  context_value: string;
  quantity: Quantity;
}

export interface QuantityInfo {
  quantity: Quantity;
  overrides?: QuantityOverride[];
}

export interface ModifierGroupOverride {
  context_type: string;
  context_value: string;
  ids: string[] | null;
}

export interface ModifierGroupIds {
  ids: string[] | null;
  overrides?: ModifierGroupOverride[];
}

export interface TaxInfo {
  [key: string]: any;
}

export interface NutritionalInfo {
  allergens: any | null;
}

export interface Classifications {
  can_serve_alone?: boolean;
  alcoholic_items?: number;
  ingredients?: any | null;
  additives?: any | null;
}

export interface DishInfo {
  classifications: Classifications;
}

export interface TaxLabelInfo {
  default_value: {
    labels: string[];
    source: string;
  };
}

export interface ProductInfo {
  product_traits: any[] | null;
  countries_of_origin: any | null;
}

export interface Item {
  id: string;
  external_data?: string;
  title: Title;
  description: Description;
  image_url: string;
  price_info: PriceInfo;
  quantity_info: QuantityInfo;
  modifier_group_ids: ModifierGroupIds;
  tax_info: TaxInfo;
  nutritional_info: NutritionalInfo;
  dish_info: DishInfo;
  tax_label_info?: TaxLabelInfo;
  product_info?: ProductInfo;
  bundled_items?: any | null;
}

export interface ModifierGroup {
  id: string;
  title?: Title;
  quantity_info?: QuantityInfo;
  modifier_options?: Entity[];
  [key: string]: any;
}

export interface MenuData {
  menus: Menu[];
  categories: Category[];
  items: Item[];
  modifier_groups?: ModifierGroup[];
}
