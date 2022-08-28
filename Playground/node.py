from math import inf
import geopy.distance


class Node:
    """ 
        This class used to represent each Vertex in the graph 
        ...
        Attributes
        ----------
        value : str
            Represent the value of the node
        x : int
            Represent the x-coordinate of the node
        y : int
            Represent the y-coordinate of the node
        heuristic_value : int
            Coresponds to the manhattan distance plus the distance from the inital node to the current node. Default value is -1
        distance_from_start
            Corresponds to the distance of the node from the initial node. Defaul value is -1
        neighbors : list
            A list with the nodes the current node is connected
        parent : Node
            Represents the parent-node of the current node. Default value is None
        ...
        Methods
        -------
        has_neighbors(self) -> Boolean
            Check if the current node is connected with other nodes (return True). Otherwise return False
        number_of_neighbors(self) -> int
            Calculate and return the number the of the neighbors 
        add_neighboor(self, neighboor) -> None
            Add a new neighbor in the list of neighbors
        extend_node(self) -> list
            return a list of nodes with which the current node is connected 
        __eq__(self, other) -> Boolean
            Determines if two nodes are equal or not, checking their values
        __str__(self) -> str
            Prints the node data
    """

    def __init__(self, value, cordinates, neighbors=None):
        self.value = value
        self.cordinates = cordinates
        self.x = cordinates[0]
        self.y = cordinates[1]
        self.heuristic_value = -1
        self.distance_from_start = inf
        if neighbors is None:
            self.neighbors = []
        else:
            self.neighbors = neighbors
        self.parent = None

    def has_neighbors(self):
        """
            Return True if the current node is connected with at least another node.
            Otherwiese return false
        """
        if len(self.neighbors) == 0:
            return False
        return True

    def number_of_neighbors(self):
        """
            Return the number of nodes with which the current node is connected
        """
        return len(self.neighbors)

    ''' '''

    def add_neighboor(self, neighboor):
        """
            Add a new node to the neighboor list. In other words create a new connection between the
            current node and the neighboor
            Paramenters
            ----------
            neighboor : node
                Represent the node with which a new connection is created
        """
        self.neighbors.append(neighboor)

    def extend_node(self):
        """
            Extends the current node, creating and returning a list with all connected nodes
            Returns
            -------
                List
        """
        children = []
        for child in self.neighbors:
            children.append(child[0])
        return children

    def __gt__(self, other):
        """
            Define which node, between current node and other node, has the greater value. 
            First examine the heuristic value. If this value is the same for both nodes 
            the function checks the lexicographic series
            Parameters
            ----------
                other: Node:
                    Represent the other node with which the current node is compared
            Returns
            -------
                Boolean
        """
        if isinstance(other, Node):
            if self.heuristic_value > other.heuristic_value:
                return True
            if self.heuristic_value < other.heuristic_value:
                return False
            return self.value > other.value

    def __eq__(self, other):
        """
            Define if current node and other node are equal, checking their values. 
            Parameters
            ----------
                other: Node:
                    Represent the other node with which the current node is compared
            Returns
            -------
                Boolean
        """
        if isinstance(other, Node):
            return self.value == other.value
        return self.value == other

    def __str__(self):
        """
            Define that a node is printed with its value. 
            Returns
            -------
                str
        """
        return self.value


def calculate_distance(node1, node2):
    cord1 = node1.cordinates
    cord2 = node2.cordinates
    return geopy.distance.geodesic(cord1, cord2).km


def estimate_pathcost_cost(graph, n1, n2):
    nod1 = graph.find_node(n1)
    nod2 = graph.find_node(n2)
    d = int(calculate_distance(nod1, nod2))
    if d in range(0, 200):
        return 50
    elif d in range(201, 400):
        return 100
    elif d in range(401, 600):
        return 196
    elif d in range(601, 800):
        return 209
    elif d in range(801, 1200):
        return 221
    elif d in range(1201, 1600):
        return 230
    elif d in range(1601, 2000):
        return 295
    elif d in range(1601, 2000):
        return 295
    elif d in range(2001, 2500):
        return 343
    elif d in range(2501, 3500):
        return 433
    elif d in range(3501, 4500):
        return 527
    elif d in range(4501, 6000):
        return 527
    elif d in range(6001, 7500):
        return 720
    elif d in range(7501, 10000):
        return 961
    else:
        return 1100
