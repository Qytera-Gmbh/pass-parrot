// ================================================================================================
// Obtained from: https://adaptivecards.io/schemas/adaptive-card.json
// Converted using: https://transform.tools/json-schema-to-typescript
// ================================================================================================

export type HttpAdaptivecardsIoSchemasAdaptiveCardJson = AdaptiveCard;
export type ExtendableAction = ExtendableItem;
export type ImplementationsOfElement = ActionSet | Image | InputChoiceSet;

/**
 * Displays a set of actions.
 */
export type ActionSet = ExtendableElement;
export type ExtendableElement = ExtendableToggleableItem;
export type ExtendableToggleableItem = ExtendableItem;
/**
 * ColumnSet divides a region into Columns, allowing elements to sit side-by-side.
 */
export type ColumnSet = ExtendableElement;
/**
 * Containers group items together.
 */
export type Container = ExtendableElement;
/**
 * The FactSet element displays a series of facts (i.e. name/value pairs) in a tabular form.
 */
export type FactSet = ExtendableElement;
export type BlockElementHeight = ("auto" | "stretch") | Record<string, unknown>;
/**
 * Controls how content is horizontally positioned within its container.
 */
export type HorizontalAlignment = ("center" | "left" | "right") | Record<string, unknown>;
/**
 * Gathers input fields, merges with optional data field, and sends an event to the client. Clients process the event by sending an Invoke activity of type adaptiveCard/action to the target Bot. The inputs that are gathered are those on the current card, and in the case of a show card those on any parent cards. See [Universal Action Model](https://docs.microsoft.com/en-us/adaptive-cards/authoring-cards/universal-action-model) documentation for more details.
 */
export type ActionExecute = ExtendableAction;
/**
 * When invoked, show the given url either by launching it in an external web browser or showing within an embedded web browser.
 */
export type ActionOpenUrl = ExtendableAction;
/**
 * Gathers input fields, merges with optional data field, and sends an event to the client. It is up to the client to determine how this data is processed. For example: With BotFramework bots, the client would send an activity through the messaging medium to the bot. The inputs that are gathered are those on the current card, and in the case of a show card those on any parent cards. See https://docs.microsoft.com/en-us/adaptive-cards/authoring-cards/input-validation for more details.
 */
export type ActionSubmit = ExtendableAction;
/**
 * An action that toggles the visibility of associated card elements.
 */
export type ActionToggleVisibility = ExtendableAction;
export type FallbackOption = "drop" | Record<string, unknown>;
/**
 * The ImageSet displays a collection of Images similar to a gallery. Acceptable formats are PNG, JPEG, and GIF
 */
export type ImageSet = ExtendableElement;
/**
 * Allows a user to input a Choice.
 */
export type InputChoiceSet = ExtendableInput;
/**
 * Lets a user choose a date.
 */
export type InputDate = ExtendableInput;
/**
 * Allows a user to enter a number.
 */
export type InputNumber = ExtendableInput;
/**
 * Lets a user enter text.
 */
export type InputText = ExtendableInput;
/**
 * Lets a user select a time.
 */
export type InputTime = ExtendableInput;
/**
 * Lets a user choose between two options.
 */
export type InputToggle = ExtendableInput;
/**
 * Displays a media player for audio or video content.
 */
export type Media = ExtendableElement;
/**
 * Defines an array of inlines, allowing for inline text formatting.
 */
export type RichTextBlock = ExtendableElement;
/**
 * Provides a way to display data in a tabular form.
 */
export type Table = ExtendableElement;
/**
 * Displays text, allowing control over font sizes, weight, and color.
 */
export type TextBlock = ExtendableElement;
export type ImplementationsOfAction = ActionExecute;

/**
 * Defines an AdaptiveCard which is shown to the user when the button or link is clicked.
 */
export type ActionShowCard = ExtendableAction;

/**
 * An Adaptive Card, containing a free-form body of card elements, and an optional set of actions.
 */
export interface AdaptiveCard {
  /**
   * The Adaptive Card schema.
   */
  $schema?: string;
  /**
   * The Actions to show in the card's action bar.
   */
  actions?: ImplementationsOfAction[];
  /**
   * Defines authentication information to enable on-behalf-of single sign on or just-in-time OAuth.
   */
  authentication?: {
    /**
     * Buttons that should be displayed to the user when prompting for authentication. The array MUST contain one button of type "signin". Other button types are not currently supported.
     */
    buttons?: AuthCardButton[];
    /**
     * The identifier for registered OAuth connection setting information.
     */
    connectionName?: string;
    /**
     * Text that can be displayed to the end user when prompting them to authenticate.
     */
    text?: string;
    /**
     * Provides information required to enable on-behalf-of single sign-on user authentication.
     */
    tokenExchangeResource?: {
      /**
       * The unique identified of this token exchange instance.
       */
      id: string;
      /**
       * An identifier for the identity provider with which to attempt a token exchange.
       */
      providerId: string;
      /**
       * Must be `TokenExchangeResource`
       */
      type?: "TokenExchangeResource";
      /**
       * An application ID or resource identifier with which to exchange a token on behalf of. This property is identity provider- and application-specific.
       */
      uri: string;
    };
    /**
     * Must be `Authentication`
     */
    type?: "Authentication";
  };
  /**
   * Specifies the background image of the card.
   */
  backgroundImage?: BackgroundImage | string;
  /**
   * The card elements to show in the primary card region.
   */
  body?: ImplementationsOfElement[];
  /**
   * Text shown when the client doesn't support the version specified (may contain markdown).
   */
  fallbackText?: string;
  /**
   * The 2-letter ISO-639-1 language used in the card. Used to localize any date/time functions.
   */
  lang?: string;
  /**
   * Specifies the minimum height of the card.
   */
  minHeight?: string;
  /**
   * Defines how the card can be refreshed by making a request to the target Bot.
   */
  refresh?: {
    /**
     * Gathers input fields, merges with optional data field, and sends an event to the client. Clients process the event by sending an Invoke activity of type adaptiveCard/action to the target Bot. The inputs that are gathered are those on the current card, and in the case of a show card those on any parent cards. See [Universal Action Model](https://docs.microsoft.com/en-us/adaptive-cards/authoring-cards/universal-action-model) documentation for more details.
     */
    action?: ExtendableAction;
    /**
     * Must be `Refresh`
     */
    type?: "Refresh";
    /**
     * A list of user Ids informing the client for which users should the refresh action should be run automatically. Some clients will not run the refresh action automatically unless this property is specified. Some clients may ignore this property and always run the refresh action automatically.
     */
    userIds?: string[];
  };
  /**
   * When `true` content in this Adaptive Card should be presented right to left. When 'false' content in this Adaptive Card should be presented left to right. If unset, the default platform behavior will apply.
   */
  rtl?: boolean | null;
  /**
   * An Action that will be invoked when the card is tapped or selected. `Action.ShowCard` is not supported.
   */
  selectAction?: ActionExecute;

  /**
   * Specifies what should be spoken for this entire card. This is simple text or SSML fragment.
   */
  speak?: string;
  /**
   * Must be `AdaptiveCard`
   */
  type?: "AdaptiveCard";
  /**
   * Schema version that this card requires. If a client is **lower** than this version, the `fallbackText` will be rendered. NOTE: Version is not required for cards within an `Action.ShowCard`. However, it *is* required for the top-level card.
   */
  version?: string;
  /**
   * Defines how the content should be aligned vertically within the container. Only relevant for fixed-height cards, or cards with a `minHeight` specified.
   */
  verticalContentAlignment?: ("bottom" | "center" | "top") | Record<string, unknown>;
}
export interface ExtendableItem {
  [k: string]: unknown;
  /**
   * A series of key/value pairs indicating features that the item requires with corresponding minimum version. When a feature is missing or of insufficient version, fallback is triggered.
   */
  requires?: Record<string, string>;
}
/**
 * Defines a button as displayed when prompting a user to authenticate. This maps to the cardAction type defined by the Bot Framework (https://docs.microsoft.com/dotnet/api/microsoft.bot.schema.cardaction).
 */
export interface AuthCardButton {
  /**
   * A URL to an image to display alongside the button's caption.
   */
  image?: string;
  /**
   * The caption of the button.
   */
  title?: string;
  /**
   * The type of the button.
   */
  type: string;
  /**
   * The value associated with the button. The meaning of value depends on the button's type.
   */
  value: string;
}
/**
 * Displays an image. Acceptable formats are PNG, JPEG, and GIF
 */
export interface Image {
  /**
   * Alternate text describing the image.
   */
  altText?: string;
  /**
   * Applies a background to a transparent image. This property will respect the image style.
   */
  backgroundColor?: string;
  /**
   * Describes what to do when an unknown element is encountered or the requires of this or any children can't be met.
   */
  fallback?: FallbackOption | ImplementationsOfElement;
  /**
   * The desired height of the image. If specified as a pixel value, ending in 'px', E.g., 50px, the image will distort to fit that exact height. This overrides the `size` property.
   */
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  height?: BlockElementHeight | string;
  /**
   * Controls how this element is horizontally positioned within its parent. When not specified, the value of horizontalAlignment is inherited from the parent container. If no parent container has horizontalAlignment set, it defaults to Left.
   */
  horizontalAlignment?: HorizontalAlignment | null;
  /**
   * A unique identifier associated with the item.
   */
  id?: string;
  /**
   * If `false`, this item will be removed from the visual tree.
   */
  isVisible?: boolean;
  /**
   * A series of key/value pairs indicating features that the item requires with corresponding minimum version. When a feature is missing or of insufficient version, fallback is triggered.
   */
  requires?: Record<string, string>;
  /**
   * An Action that will be invoked when the `Image` is tapped or selected. `Action.ShowCard` is not supported.
   */
  selectAction?: ActionExecute;

  /**
   * When `true`, draw a separating line at the top of the element.
   */
  separator?: boolean;
  /**
   * Controls the approximate size of the image. The physical dimensions will vary per host.
   */
  size?: ("auto" | "large" | "medium" | "small" | "stretch") | Record<string, unknown>;
  /**
   * Controls the amount of spacing between this element and the preceding element.
   */
  spacing?:
    | ("default" | "extraLarge" | "large" | "medium" | "none" | "padding" | "small")
    | Record<string, unknown>;
  /**
   * Controls how this `Image` is displayed.
   */
  style?: ("default" | "person") | Record<string, unknown>;
  /**
   * Must be `Image`
   */
  type?: "Image";
  /**
   * The URL to the image. Supports data URI in version 1.2+
   */
  url: string;
  /**
   * The desired on-screen width of the image, ending in 'px'. E.g., 50px. This overrides the `size` property.
   */
  width?: string;
}
/**
 * Base input class
 */
export interface ExtendableInput {
  [k: string]: unknown;
  /**
   * Error message to display when entered input is invalid
   */
  errorMessage?: string;
  /**
   * Describes what to do when an unknown element is encountered or the requires of this or any children can't be met.
   */
  fallback?: FallbackOption | ImplementationsOfElement;
  /**
   * Specifies the height of the element.
   */
  height?: ("auto" | "stretch") | Record<string, unknown>;
  /**
   * Unique identifier for the value. Used to identify collected input when the Submit action is performed.
   */
  id: string;
  /**
   * Whether or not this input is required
   */
  isRequired?: boolean;
  /**
   * If `false`, this item will be removed from the visual tree.
   */
  isVisible?: boolean;
  /**
   * Label for this input
   */
  label?: string;
  /**
   * A series of key/value pairs indicating features that the item requires with corresponding minimum version. When a feature is missing or of insufficient version, fallback is triggered.
   */
  requires?: Record<string, string>;
  /**
   * When `true`, draw a separating line at the top of the element.
   */
  separator?: boolean;
  /**
   * Controls the amount of spacing between this element and the preceding element.
   */
  spacing?:
    | ("default" | "extraLarge" | "large" | "medium" | "none" | "padding" | "small")
    | Record<string, unknown>;
}
/**
 * Specifies a background image. Acceptable formats are PNG, JPEG, and GIF
 */
export interface BackgroundImage {
  /**
   * Describes how the image should fill the area.
   */
  fillMode?:
    | ("cover" | "repeat" | "repeatHorizontally" | "repeatVertically")
    | Record<string, unknown>;
  /**
   * Describes how the image should be aligned if it must be cropped or if using repeat fill mode.
   */
  horizontalAlignment?: ("center" | "left" | "right") | Record<string, unknown>;
  /**
   * Must be `BackgroundImage`
   */
  type?: "BackgroundImage";
  /**
   * The URL (or data url) of the image. Acceptable formats are PNG, JPEG, and GIF
   */
  url: string;
  /**
   * Describes how the image should be aligned if it must be cropped or if using repeat fill mode.
   */
  verticalAlignment?: ("bottom" | "center" | "top") | Record<string, unknown>;
}
