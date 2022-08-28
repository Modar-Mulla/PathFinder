
from .models import *
from .serializer import *
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from Playground.graph import Graph
from Playground.node import *
from Playground.astar import AStar
import folium

@api_view()
def get_countries(request):
    queryset = Country.objects.all()
    countries = CountrySerializer(queryset, many=True)
    return Response(countries.data)

@api_view()
def get_cities(request, country):
    country = Country.objects.get(country_name=country)
    country_id = country.id
    queryset = City.objects.filter(country_id=country_id)
    cities = CitySerializer(queryset, many=True)
    return Response(cities.data)




@api_view(["GET", "POST"])
def home_page(request):
    if request.method == "GET":
        return render(request, "home.html")
    if request.method == "POST":
        serializer = GraphSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        graph_data = data["graph"]
    # # Initializing Graph
        graph = Graph()

    # # Creating And Adding Nodes
        for node in graph_data['nodes'].values():
            name = node
            coords = (City.objects.filter(name=name).first().lat,
                      City.objects.filter(name=name).first().lng)
            graph.add_node(Node(name, coords))
    # Creating Edges
        for edge in graph_data["edges"].values():
            graph.add_edge(edge['from'], edge['to'], estimate_pathcost_cost(
                graph, edge['from'], edge['to']))

    # # # Execute the algorithm
        alg = AStar(graph, graph_data['start'], graph_data['end'])
        path, path_length = alg.search()
        print(" -> ".join(path))
        print(f"Length of the path: {path_length}")

    # # Creating Map
        map = folium.Map(location=[City.objects.filter(name=graph_data['start']).first().lat,
                                   City.objects.filter(name=graph_data['start']).first().lng], zoom_start=5)
        # # Getting Path coords
        path_coords = []
        for node in path:
            node_coords = (City.objects.filter(name=node).first().lat,
                           City.objects.filter(name=node).first().lng)
            folium.Marker(location=[City.objects.filter(name=node).first().lat,
                                    City.objects.filter(name=node).first().lng], tooltip="Click To See Country Name", popup=node).add_to(map)
            path_coords.append(node_coords)
        folium.PolyLine(path_coords,
                        color='blue',
                        weight=2,
                        opacity=0.6).add_to(map)

        map = map._repr_html_()
        context = {
            'map': map
        }

        return render(request, "map.html", context)





