$(document).ready(function () {
    function table(data) {
        let table_Data = "<tr>";
        for (var i = 0; i < data.length; i++) {
            table_Data += "<td>" + data[i].address + "</td>";
            table_Data += "<td>" + data[i].city + "</td>";
            table_Data += "<td>" + data[i].postal_code + "</td>";
            table_Data += "<td>" + data[i].community + "</td>";
            table_Data += "<td>" + data[i].province + "</td>";
            table_Data += "<td>" + data[i].price + "</td>";
            table_Data += "<td>" + data[i].bedrooms + "</td>";
            table_Data += "<td>" + data[i].bathrooms + "</td>";
            table_Data += "<td>" + '<img src="' + data[i].img + '">' + "</td>";
            table_Data += "<td>" + data[i].description + "</td>";
            table_Data += "</tr>";
        }

        $("#body_Output").html(table_Data);
    }

    $("#all").click(function () {
        $.get({
            url: "http://localhost:3000/all",
            success: table,
            dataType: "json",
        });
    });

    function community_Filter(community_Name) {
        $.get({
            url: "http://localhost:3000/community_search?community=" + community_Name,
            success: table,
            dataType: "json",
        });
    }

    $("#ancaster").click(function () {
        community_Filter("Ancaster");
    });

    $("#dundas").click(function () {
        community_Filter("Dundas");
    });

    $("#mountain").click(function () {
        community_Filter("Mountain");
    });

    $("#stoney_Creek").click(function () {
        community_Filter("Stoney Creek");
    });

    $("#waterdown").click(function () {
        community_Filter("Waterdown");
    });


    $("#filter_Bedroom").click(function () {

        var num_Bedrooms = $("#select_Bedroom option:selected").val();
        if (num_Bedrooms >= 0) {
            $.get({
                url: "http://localhost:3000/bed_search?bedrooms=" + num_Bedrooms,
                success: table,
                dataType: "json",
            });
        }

    });

    $("#filter_Bathroom").click(function () {

        var num_Bathrooms = $("#select_Bathroom option:selected").val();

        if (num_Bathrooms >= 0) {
            $.get({
                url: "http://localhost:3000/bathroom_search?bathrooms=" + num_Bathrooms,
                success: table,
                dataType: "json",
            });
        }

    });

    $("#filter_Price").click(function () {
        var min = $("#min").val();
        var max = $("#max").val();
        $.get({
            url: "http://localhost:3000/price_search?min=" + min + "&max=" + max,
            success: table,
            dataType: "json",
        });
    });

    $.get({
        url: "http://localhost:3000/all",
        success: table,
        dataType: "json",
    });


});
