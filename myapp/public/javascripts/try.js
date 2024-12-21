
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
          title: "Uluru",
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

          // Add the latest char sequence to the request.
          request.input = input.target.value;

          // Fetch autocomplete suggestions and show them in a list.
          // @ts-ignore
          const { suggestions } =
            await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(
              request,
            );

          title.innerText = 'Query predictions for "' + request.input + '"';
          // Clear the list first.
          results.replaceChildren();

          for (const suggestion of suggestions) {
            const placePrediction = suggestion.placePrediction;
            // Create a link for the place, add an event handler to fetch the place.
            const a = document.createElement("a");
            a.classList.add("information")
            a.addEventListener("click", () => {
              onPlaceSelected(placePrediction.toPlace());
            });
            a.innerText = placePrediction.text.toString();

            // Create a new list element.
            const li = document.createElement("li");

            li.appendChild(a);
            results.appendChild(li);
          }
        }

        function Output(name,location,rating,priceLevel,OpeningHours,id){
          this.name=name;
          this.location=location;
          this.rating=rating;
          if (priceLevel===NaN ||priceLevel===null||priceLevel===undefined)
          {
            priceLevel="沒有資料";
          }
          this.priceLevel=priceLevel;
          this.OpeningHours=OpeningHours;
          this.id=id;
        }

        async function onPlaceSelected(place) {
          await place.fetchFields({
            fields:["location","displayName","formattedAddress","id","rating","priceLevel","regularOpeningHours","types"],
          });
            for (element of place.types){
              if(element==="restaurant")
              {

                let out;
                $.get("/data",out)
            for(i=0; out!=undefined && i<out.length;i++)
            {
              if(element.id===place.id)
              {
                alert("資料已經存在");
                return
              }
            }
            button.onclick=() => {
              // 檢查按鈕是否已經是暗的狀態
              if (!button.classList.contains("disabled")) {
                button.classList.add("disabled");
                button.textContent = "已提交";
                let outs= new Output(place.displayName,place.formattedAddress,place.rating,place.priceLevel,place.regularOpeningHours.weekdayDescriptions,place.id);
                $.post("/data",outs);
                displayRestaurants()
              }
            }
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
            return
          }}
          alert("這不是間餐廳");
          return;
        }

        // Helper function to refresh the session token.
        async function refreshToken(request) {
          // Create a new session token and add it to the request.
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