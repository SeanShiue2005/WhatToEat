
   (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})
      ({key: "AIzaSyBe_lVY291SKiWQQizdzzME1LvDVYQ3C94", v: "weekly",region:"tw"});
      const button = document.getElementById("toggleButton");
      let map;
      let title;
      let results;
      let input;
      let token;
      let infoWindow;
      let marker;
      let request = {
        input: "",
        includedPrimaryTypes: ["restaurant"],
        language: "zh-tw",
        region: "tw",
      };

      async function initMap() {
        const position = { lat: 25.150622313721396, lng: 121.7757648486997 };
        const { Map } = await google.maps.importLibrary("maps");
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
        const { Places} = await google.maps.importLibrary("places");

        let map_show = document.getElementById("map");
        map = new Map(map_show, {
          zoom: 16,
          center: position,
          mapId: "DEMO_MAP_ID",
        });
      
        // 地標圖示
        marker = new AdvancedMarkerElement({
          map: map,
          position: position,
          title: "地點",
        });
          infoWindow = new google.maps.InfoWindow({});
          token = new google.maps.places.AutocompleteSessionToken();
          title = document.getElementById("title");
          results = document.getElementById("results");
          input = document.querySelector("input");
          input.addEventListener("input", makeAcRequest);
          request = refreshToken(request);
      }

        async function makeAcRequest(input) {
          // Reset elements and exit if an empty string is received.
          if (input.target.value == "") {
            title.innerText = "";
            results.replaceChildren();
            return;
          }
          request.input = input.target.value;
          const { suggestions } =
            await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(
              request,
            );

          title.innerText = '"' + request.input + '"的搜尋結果是:';
          // Clear the list first.
          results.replaceChildren();

          for (const suggestion of suggestions) {
            const placePrediction = suggestion.placePrediction;
            // Create a link for the place, add an event handler to fetch the place.
            const a = document.createElement("a");
            a.addEventListener("click", () => {
              onPlaceSelected(placePrediction.toPlace());
            });
            a.classList.add("information")
            a.innerText = placePrediction.text.toString();

            // Create a new list element.
            const li = document.createElement("li");
            li.appendChild(a);
            results.appendChild(li);
          }
        }

        function Output(name,location,rating,priceLevel,OpeningHours,id,Brunch,Lunch,Dinner,latlong){
          let OpeningArray=[]
          this.name=name;
          this.location=location;
          this.rating=rating;
          if (priceLevel===NaN ||priceLevel===null||priceLevel===undefined)
          {
            priceLevel="沒有資料";
          }
          this.priceLevel=priceLevel;
          for (period of OpeningHours)
          {
            let data={
              day:period.open.day,
              open:[period.open.hour,period.open.minute],
              close:[period.close.hour,period.close.minute]
            }
            OpeningArray.push(data);
          }
          this.OpeningHours=OpeningArray;
          this.OpeningTimes=[!!Brunch,!!Lunch,!!Dinner];
          this.id=id;
          this.latlong=latlong
        }

        async function onPlaceSelected(place) {
          await place.fetchFields({
            fields:["location","displayName","formattedAddress","id","rating","priceLevel","regularOpeningHours","types","servesBrunch","servesLunch","servesDinner","location"],
          });
          $.ajax({url:"/verify_data",
                  type:"POST",
                  data:JSON.stringify({types:place.types,id:place.id}),
                  contentType:"application/json",
                  success:(ou)=>{
                    console.log(ou);
              button.onclick=() => {
              if (!button.classList.contains("disabled")) {
                button.classList.add("disabled");
                button.textContent = "已提交";
                let outs= new Output(place.displayName,place.formattedAddress,place.rating,place.priceLevel,place.regularOpeningHours.periods,place.id,place.servesBrunch,place.servesLunch,place.servesDinner,place.location);
                console.log(place.regularOpeningHours.periods);
                $.ajax({
                  url: "/data",
                  type: "POST",
                  data: JSON.stringify(outs),
                  contentType: "application/json",
                  success: () => {
                    console.log("資料上傳完成");
                    displayRestaurants()
                  },
                  error: (error) => {
                    console.log(error);
                  },
                })}};
            let placeText = document.createTextNode(
              place.displayName + ": " + place.formattedAddress,
            );
  
            results.replaceChildren(placeText);
            title.innerText = "Selected Place:";
            input.value = "";
            if (place.viewport) {
              map.fitBounds(place.viewport);
            } else {
              map.setCenter(place.location);
              map.setZoom(18);
            }
            
            let content =
              '<div id="infowindow-content">' +
              '<span id="place-displayname" class="title">' +
              place.displayName +
              "</span><br />" +
              '<span id="place-address">' +
              place.formattedAddress +
              "</span>" +
              "</div>";
        
            updateInfoWindow(content, place.location);
            marker.position = place.location;
        
            refreshToken(request);
            button.classList.remove("disabled");
            button.textContent="提交";
          }
        ,
        error:(err)=>{
        {
          alert(err.responseJSON.message);
        }
        }})};

        async function refreshToken(request) {
          token = new google.maps.places.AutocompleteSessionToken()
          request.sessionToken = token;
          return request;
        }

        function updateInfoWindow(content, center) {
          infoWindow.setContent(content);
          infoWindow.setPosition(center);
          infoWindow.open({
            map,
            anchor: marker,
            shouldFocus: false,
          });
        }

      initMap();