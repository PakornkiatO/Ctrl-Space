const buildReservationFlexMessage = (reservations) => ({
    type: "flex",
    altText: "Here are your reservations",
    contents: {
        type: "carousel",
        contents: reservations.map((r) => ({
            type: "bubble",
            body: {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "text",
                        text: r.coworking.name,
                        weight: "bold",
                        size: "xl",
                    },
                    {
                        type: "text",
                        text: `📅 ${new Date(r.rsDate).toLocaleString()}`,
                        margin: "md",
                        size: "sm",
                    },
                    {
                        type: "text",
                        text: r.coworking.address,
                        wrap: true,
                        size: "sm",
                        color: "#888888",
                    },
                ],
            },
            footer: {
                type: "box",
                layout: "horizontal",
                spacing: "md",
                contents: [
                    {
                        type: "button",
                        style: "primary",
                        color: "#FF5555",
                        action: {
                            type: "postback",
                            label: "Cancel",
                            data: `action=cancel&id=${r._id}`,
                        },
                    },
                    {
                        type: "button",
                        style: "secondary",
                        action: {
                            type: "postback",
                            label: "Edit",
                            data: `action=edit&id=${r._id}`,
                        },
                    },
                ],
            },
        })),
    },
});
const testFlexMessage = () => ({
    type: "bubble",
    hero: {
        type: "image",
        url: "https://developers-resource.landpress.line.me/fx/img/01_1_cafe.png",
        size: "full",
        aspectRatio: "20:13",
        aspectMode: "cover",
        action: {
            type: "uri",
            uri: "https://line.me/",
        },
    },
    body: {
        type: "box",
        layout: "vertical",
        contents: [
            {
                type: "text",
                text: "Brown Cafe",
                weight: "bold",
                size: "xl",
            },
            {
                type: "box",
                layout: "baseline",
                margin: "md",
                contents: [
                    {
                        type: "icon",
                        size: "sm",
                        url: "https://developers-resource.landpress.line.me/fx/img/review_gold_star_28.png",
                    },
                    {
                        type: "icon",
                        size: "sm",
                        url: "https://developers-resource.landpress.line.me/fx/img/review_gold_star_28.png",
                    },
                    {
                        type: "icon",
                        size: "sm",
                        url: "https://developers-resource.landpress.line.me/fx/img/review_gold_star_28.png",
                    },
                    {
                        type: "icon",
                        size: "sm",
                        url: "https://developers-resource.landpress.line.me/fx/img/review_gold_star_28.png",
                    },
                    {
                        type: "icon",
                        size: "sm",
                        url: "https://developers-resource.landpress.line.me/fx/img/review_gray_star_28.png",
                    },
                    {
                        type: "text",
                        text: "4.0",
                        size: "sm",
                        color: "#999999",
                        margin: "md",
                        flex: 0,
                    },
                ],
            },
            {
                type: "box",
                layout: "vertical",
                margin: "lg",
                spacing: "sm",
                contents: [
                    {
                        type: "box",
                        layout: "baseline",
                        spacing: "sm",
                        contents: [
                            {
                                type: "text",
                                text: "Place",
                                color: "#aaaaaa",
                                size: "sm",
                                flex: 1,
                            },
                            {
                                type: "text",
                                text: "Flex Tower, 7-7-4 Midori-ku, Tokyo",
                                wrap: true,
                                color: "#666666",
                                size: "sm",
                                flex: 5,
                            },
                        ],
                    },
                    {
                        type: "box",
                        layout: "baseline",
                        spacing: "sm",
                        contents: [
                            {
                                type: "text",
                                text: "Time",
                                color: "#aaaaaa",
                                size: "sm",
                                flex: 1,
                            },
                            {
                                type: "text",
                                text: "10:00 - 23:00",
                                wrap: true,
                                color: "#666666",
                                size: "sm",
                                flex: 5,
                            },
                        ],
                    },
                ],
            },
        ],
    },
    footer: {
        type: "box",
        layout: "vertical",
        spacing: "sm",
        contents: [
            {
                type: "button",
                style: "link",
                height: "sm",
                action: {
                    type: "uri",
                    label: "CALL",
                    uri: "https://line.me/",
                },
            },
            {
                type: "button",
                style: "link",
                height: "sm",
                action: {
                    type: "uri",
                    label: "WEBSITE",
                    uri: "https://line.me/",
                },
            },
            {
                type: "box",
                layout: "vertical",
                contents: [],
                margin: "sm",
            },
        ],
        flex: 0,
    },
});

module.exports = { buildReservationFlexMessage, testFlexMessage };
