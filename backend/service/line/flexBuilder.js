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
// function buildReservationFlexMessage(reservations) {
//     const bubbles = reservations.map((rsv) => ({
//         type: "bubble",
//         body: {
//             type: "box",
//             layout: "vertical",
//             contents: [
//                 {
//                     type: "text",
//                     text: rsv.coworking.name,
//                     weight: "bold",
//                     size: "xl",
//                     wrap: true,
//                 },
//                 {
//                     type: "text",
//                     text: rsv.coworking.address,
//                     size: "sm",
//                     color: "#666666",
//                     wrap: true,
//                     margin: "md",
//                 },
//                 {
//                     type: "box",
//                     layout: "vertical",
//                     spacing: "sm",
//                     margin: "md",
//                     contents: [
//                         {
//                             type: "text",
//                             text: `📅 ${moment(rsv.rsDate).format(
//                                 "YYYY-MM-DD"
//                             )}`,
//                             size: "sm",
//                         },
//                         {
//                             type: "text",
//                             text: `⏰ ${rsv.startTime} - ${rsv.endTime}`,
//                             size: "sm",
//                         },
//                     ],
//                 },
//             ],
//         },
//     }));

//     return {
//         type: "flex",
//         altText: "📋 Your Reservations",
//         contents: {
//             type: "carousel",
//             contents: bubbles,
//         },
//     };
// }

module.exports = { testFlexMessage, buildReservationFlexMessage };
