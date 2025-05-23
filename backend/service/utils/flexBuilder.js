const moment = require("moment-timezone");
const { formatDate, formatTime } = require("../../utils/lineClient");
const { loginUrl } = require("../../utils/lineClient");
const { getCoworking } = require("../../controllers/coworkings");
function registrationStartFlex() {
    return {
        type: "flex",
        altText: "Please log in to continue",
        contents: {
            type: "bubble",
            direction: "ltr",
            // hero: {
            //     type: "image",
            //     url: "https://example.com/your-image.png", // Optional: Add a welcoming image
            //     size: "full",
            //     aspectRatio: "16:9",
            //     aspectMode: "cover",
            // },
            body: {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "text",
                        text: "Welcome to the registration process!",
                        weight: "bold",
                        size: "lg",
                    },
                    {
                        type: "text",
                        text: "Please authenticate using your LINE account.",
                        size: "sm",
                        color: "#aaaaaa",
                    },
                    {
                        type: "button",
                        action: {
                            type: "uri",
                            label: "Login with LINE",
                            uri: "https://your-backend-url.com/line-login", // Redirect to your backend for LINE OAuth
                        },
                        style: "primary",
                    },
                ],
            },
        },
    };
}

const testFlexMessage = () => ({
    type: "bubble",
    header: {
        type: "box",
        layout: "vertical",
        contents: [
            {
                type: "box",
                layout: "horizontal",
                contents: [
                    {
                        type: "image",
                        url: "https://developers-resource.landpress.line.me/fx/clip/clip4.jpg",
                        size: "full",
                        aspectMode: "cover",
                        aspectRatio: "150:196",
                        gravity: "center",
                        flex: 1,
                    },
                    {
                        type: "box",
                        layout: "vertical",
                        contents: [
                            {
                                type: "image",
                                url: "https://developers-resource.landpress.line.me/fx/clip/clip5.jpg",
                                size: "full",
                                aspectMode: "cover",
                                aspectRatio: "150:98",
                                gravity: "center",
                            },
                            {
                                type: "image",
                                url: "https://developers-resource.landpress.line.me/fx/clip/clip6.jpg",
                                size: "full",
                                aspectMode: "cover",
                                aspectRatio: "150:98",
                                gravity: "center",
                            },
                        ],
                        flex: 1,
                    },
                    {
                        type: "box",
                        layout: "horizontal",
                        contents: [
                            {
                                type: "text",
                                text: "NEW",
                                size: "xs",
                                color: "#ffffff",
                                align: "center",
                                gravity: "center",
                            },
                        ],
                        backgroundColor: "#EC3D44",
                        paddingAll: "2px",
                        paddingStart: "4px",
                        paddingEnd: "4px",
                        flex: 0,
                        position: "absolute",
                        offsetStart: "18px",
                        offsetTop: "18px",
                        cornerRadius: "100px",
                        width: "48px",
                        height: "25px",
                    },
                ],
            },
        ],
        paddingAll: "0px",
    },
    body: {
        type: "box",
        layout: "vertical",
        contents: [
            {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "box",
                        layout: "vertical",
                        contents: [
                            {
                                type: "text",
                                contents: [],
                                size: "xl",
                                wrap: true,
                                text: "Cony Residence",
                                color: "#ffffff",
                                weight: "bold",
                            },
                            {
                                type: "text",
                                text: "3 Bedrooms, ¥35,000",
                                color: "#ffffffcc",
                                size: "sm",
                            },
                        ],
                        spacing: "sm",
                    },
                    {
                        type: "box",
                        layout: "vertical",
                        contents: [
                            {
                                type: "box",
                                layout: "vertical",
                                contents: [
                                    {
                                        type: "text",
                                        contents: [],
                                        size: "sm",
                                        wrap: true,
                                        margin: "lg",
                                        color: "#ffffffde",
                                        text: "Private Pool, Delivery box, Floor heating, Private Cinema",
                                    },
                                ],
                            },
                        ],
                        paddingAll: "13px",
                        backgroundColor: "#ffffff1A",
                        cornerRadius: "2px",
                        margin: "xl",
                    },
                ],
            },
        ],
        paddingAll: "20px",
        backgroundColor: "#464F69",
    },
});
const loginRequestFlex = () => ({
    type: "bubble",
    hero: {
        type: "image",
        url: "https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png",
        size: "full",
        aspectRatio: "20:13",
        aspectMode: "cover",
    },
    body: {
        type: "box",
        layout: "vertical",
        contents: [
            {
                type: "text",
                text: "Welcome to our service!",
                weight: "bold",
                size: "xl",
                margin: "md",
            },
            {
                type: "text",
                text: "Tap the button below to login using CTRL-Space.",
                wrap: true,
                color: "#666666",
                size: "sm",
                margin: "md",
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
                style: "primary",
                color: "#00C300",
                action: {
                    type: "uri",
                    label: "Login",
                    uri: loginUrl, // Replace with your actual LINE Login URL
                },
            },
        ],
    },
});
function getCoworkingFlex(coworkings, page = 1, totalPages = 1) {
    const items = coworkings.map((c) => ({
        type: "bubble",
        body: {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "text",
                    text: c.name,
                    weight: "bold",
                    size: "lg",
                    wrap: true,
                },
                {
                    type: "text",
                    text: c.description || "No description",
                    size: "sm",
                    wrap: true,
                    margin: "sm",
                },
                {
                    type: "text",
                    text: `📍 ${c.address || "NO address"}`,
                    size: "sm",
                    wrap: true,
                    margin: "sm",
                },
                {
                    type: "text",
                    text: `🕒 ${c.open_hour} - ${c.close_hour}`,
                    size: "sm",
                    wrap: true,
                    margin: "sm",
                },
                {
                    type: "button",
                    action: {
                        type: "postback",
                        label: "Reserve",
                        data: `action=createReservation&coworkingId=${c.id}`,
                        displayText: `Reserve at ${c.name}`,
                    },
                    style: "primary",
                    margin: "md",
                },
            ],
        },
    }));

    if (page < totalPages) {
        items.push({
            type: "bubble",
            body: {
                type: "box",
                layout: "vertical",
                justifyContent: "center",
                contents: [
                    {
                        type: "button",
                        action: {
                            type: "postback",
                            label: "▶️ Next Page",
                            data: `action=getCoworking&page=${page + 1}`,
                            displayText: "Next Page",
                        },
                        style: "primary",
                    },
                ],
            },
        });
    }

    return {
        type: "flex",
        altText: "📍 Coworking Spaces",
        contents: {
            type: "carousel",
            contents: items,
        },
    };
}

function viewReservationFlex(reservations) {
    const timeZone = "Asia/Bangkok"; // Define the timezone here

    // Helper function to format time in the Thai timezoner
    const bubbles = reservations.map((rsv) => {
        return {
            type: "bubble",
            body: {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "text",
                        text: rsv.coworking.name,
                        weight: "bold",
                        size: "xl",
                        wrap: true,
                    },
                    {
                        type: "text",
                        text: rsv.coworking.address,
                        size: "sm",
                        color: "#666666",
                        wrap: true,
                        margin: "md",
                    },
                    {
                        type: "box",
                        layout: "vertical",
                        spacing: "sm",
                        margin: "md",
                        contents: [
                            {
                                type: "text",
                                text: `📅 ${new Intl.DateTimeFormat("en-US", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    timeZone: timeZone,
                                }).format(new Date(rsv.rsDate))}`,
                                size: "sm",
                            },
                            {
                                type: "text",
                                text: `⏰ ${rsv.startTime} - ${rsv.endTime}`,
                                size: "sm",
                            },
                        ],
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
                        color: "#1E90FF",
                        action: {
                            type: "postback",
                            label: "Edit Time",
                            data: `action=edit&id=${rsv._id}`,
                        },
                    },
                    {
                        type: "button",
                        style: "secondary",
                        color: "#FF5551",
                        action: {
                            type: "postback",
                            label: "Cancel",
                            data: `action=cancel&id=${rsv._id}`,
                        },
                    },
                ],
            },
        };
    });

    return {
        type: "flex",
        altText: "📋 Your Reservations",
        contents: {
            type: "carousel",
            contents: bubbles,
        },
    };
}

module.exports = {
    testFlexMessage,
    viewReservationFlex,
    loginRequestFlex,
    getCoworkingFlex,
};
