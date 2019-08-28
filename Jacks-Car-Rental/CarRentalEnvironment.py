# -*- coding: utf-8 -*-
"""
Created on Mon Jun 10 17:30:57 2019

@author: favodar
"""

import math
import numpy as np

# =============================================================================
# This python script models Jack's car rental from the Book "Reinforcement
# Learning: an Introduction" by Sutton and Barto.
# It is able to calculate the probability of transitioning from a specified
# number of cars at the rental stations one day to a given number of cars the
# next day, receiving a specified reward, with the "prob"-function.
# It is also able to generate a list of transition probabilities from all
# possible states to all possible states - factoring in the chosen action and
# possible rewards - via the "env"-function.
# =============================================================================

maxCars = 8
# nrOfStates is the number of values that c1 or c2 can have, which is one more than maxCars because the value can be zero.
nrOfStates = maxCars+1

class state:
    """
    State class that represents the distribution of cars at the stations at a
    point in time.
    
    Attributes:
        c1 (int): Number of cars at car station 1.
        c2 (int): Number of cars at car station 2.
    """
    def __init__(self, c1, c2):
        self.c1 = c1
        self.c2 = c2


# return (expectedValue^n)/n!*e^-expectedValue
def poisson(n, expectedValue):
    """
    Calculates the probability-value of an integer in a poisson distribution.
    
    Args:
        n (int): quantity of which you want to know the probability
        expectedValue (float): the average value that defines the poisson distribution
        
    Returns:
        float: probability of "n" in distribution "expectedValue"
    """
    # Only consider whole numbers
    if n<0 or n%1!=0:
        return 0
    else:
        return (expectedValue**n)/math.factorial(n)*math.exp(-expectedValue)

# the following four functions call the poisson function with the expected values given by the excercise
def returnAtLocation1(number):
    prob = poisson(number, 3)
    return prob

def requestAtLocation1(number):
    prob = poisson(number, 3)
    return prob

def requestAtLocation2(number):
    prob = poisson(number, 4)
    return prob

def returnAtLocation2(number):
    prob = poisson(number, 2)
    return prob
##

def prob(state2, reward, state1, action):
    """
    Calculates the probability of transitioning to state2 with reward "reward",
    under the condition of starting in state1 and chosing action "action".
    
    The states are assumed to be a snapshot of an evening, after the daily
    business has taken place and before cars are moved from one station to
    another overnight. This way, the result of the day is known and cars can
    be moved accordingly before the next business day.
    
    Args:
        state2 (state): the target state (comprised of the values c1 and c2)
        reward (float): the reward DIVIDED BY 10 that the transition is supposed to give. This means a request counts as 1 reward and the cost of moving a car is 0.2 reward. The reward is the sum of the money received from requests the next day, minus the cost of moving cars during the night between state1 and state2)
        state1 (state): the starting state
        action (int): an integer between -5 and 5 which signifies the number of cars moved. Positive numbers: cars moved from c1 to c2. Negative numbers: cars moved from c2 to c1. E.g. -3 = 3 cars moved overnight from c2 to c1. 0 Means no cars moved.
        
    Returns:
        float: probability of the transition
    """
    #special cases if maxCars cars are in the new state (state2) at either station, since the excercise specifies that if either station contains more than maxCars cars at the end of the day, the number is cut to maxCars.
    if state2.c1==maxCars:
        if state2.c2==maxCars:
            return probMaxC1C2(state2, reward, state1, action)
        else:
            return probMaxC1(state2, reward, state1, action)
    elif state2.c2==maxCars:
        return probMaxC2(state2, reward, state1, action)
    
    
    #the actual function begins here
    probability = float(0)
    #the reward gained by requests alone can be calculated by reversing the action-cost
    requestReward = reward + abs(action)*0.2
    #The following filters out impossible action/reward pairs (non-integer rewards are impossible after correcting for action costs)
    #the correct statement would compare requestReward modulo 1 to 0 (and not to 0.01), but binary/decimal conversion imprecision needs to be accounted for.
    
    if requestReward%1!=0:        
        if requestReward%1 > 0.01:
            return 0.0
        else:
            print("requestReward is not integer = " + str(requestReward))
    n = 0
    while (requestReward-n)>=0:
        if((requestReward-n)<=(state1.c1+action) and n<=(state1.c2-action)):
            #print("enough cars")
            probability += requestAtLocation1(requestReward-n)*returnAtLocation1(state2.c1-state1.c1+(requestReward-n)-action)*requestAtLocation2(n)*returnAtLocation2(state2.c2-state1.c2+n+action)
        n += 1
    return probability

def probMaxC2(state2, reward, state1, action):
    """
    Calculates the probability of transitioning from one state to a target
    state where state2.c2 = maxCars.
    
    Since there are infinite possibilities to reach c2 = maxCars (all paths that
    lead to c2 > maxCars are also mapped to c2 = maxCars), this function sums up all
    paths that *do not* lead to c2 >= maxCars and substracts their combined
    probability from the general probability of receiving the specified reward.
    
    This function should not be called directly, as it is called by the
    prob-function in appropriate cases.
    
    Args:
        state2 (state): the state (comprised of the values c1 and c2) the transition is TO
        reward (float): the reward DIVIDED BY 10 that the transition is supposed to give. This means a request counts as 1 reward and the cost of moving a car is 0.2 reward. The reward is the sum of the money received from requests the next day, minus the cost of moving cars during the night between state1 and state2)
        state1 (state): the state the transition is FROM
        action (int): an integer between -5 and 5 which signifies the number of cars moved. Positive numbers: cars moved from c1 to c2. Negative numbers: cars moved from c2 to c1. E.g. -3 = 3 cars moved overnight from c2 to c1. 0 Means no cars moved.
        
    Returns:
        float: probability of the transition
    """
    probability = float(0)
    requestReward = reward - abs(action)*0.2
    if requestReward%1 > 0.01:
        return 0.0
    n = 0
    i = 1 #counter that counts down to all reachable states that are below the desired state maxCars
    while (requestReward-n)>=0:
        if((requestReward-n)<=(state1.c1+action) and n<=(state1.c2-action)):
            #print("enough cars")
            #The aggregated probabilities of all states that have 19 or less cars in C2
            inverseProbabilityC2 = 0
            #Sum up the probabilities of all reachable states that have 19 or less cars in C2.
            #States that are below the initial state cant be reached and can therefore be dismissed, except the number of requests or actions is big enough
            #e.g. its only possible to start with 18 cars and end up with 15 cars if there are at least 3 requests, or if at least 3 cars are removed overnight, or a combination of both
            while i<=(state2.c2-state1.c2+n+action):
                inverseProbabilityC2 += returnAtLocation2(maxCars-state1.c2+n+action-i)
                i += 1
            probability += requestAtLocation1(requestReward-n)*returnAtLocation1(state2.c1-state1.c1+(requestReward-n)-action)*(requestAtLocation2(n)-requestAtLocation2(n)*inverseProbabilityC2)
        n += 1
        i = 1
        
    return probability

def probMaxC1(state2, reward, state1, action):
    """
    Calculates the probability of transitioning from one state to a target
    state where state2.c1 = maxCars.
    
    Since there are infinite possibilities to reach c1 = maxCars (all paths that
    lead to c1 > maxCars are also mapped to c1 = maxCars), this function sums up all
    paths that *do not* lead to c1 >= maxCars and substracts their combined
    probability from the general probability of receiving the specified reward.
    
    This function should not be called directly, as it is called by the
    prob-function in appropriate cases.
    
    Args:
        state2 (state): the state (comprised of the values c1 and c2) the transition is TO
        reward (float): the reward DIVIDED BY 10 that the transition is supposed to give. This means a request counts as 1 reward and the cost of moving a car is 0.2 reward. The reward is the sum of the money received from requests the next day, minus the cost of moving cars during the night between state1 and state2)
        state1 (state): the state the transition is FROM
        action (int): an integer between -5 and 5 which signifies the number of cars moved. Positive numbers: cars moved from c1 to c2. Negative numbers: cars moved from c2 to c1. E.g. -3 = 3 cars moved overnight from c2 to c1. 0 Means no cars moved.
        
    Returns:
        float: probability of the transition
    """
    probability = float(0)
    requestReward = reward + abs(action)*0.2
    if requestReward%1 > 0.01:
        return 0.0
    n = 0
    i = 1 #counter that counts down to all reachable states that are below the desired state maxCars
    while (requestReward-n)>=0:
        if((requestReward-n)<=(state1.c1+action) and n<=(state1.c2-action)):
            #print("enough cars")
            #The aggregated probabilities of all states that have 19 or less cars in C2
            inverseProbabilityC1 = 0
            #Sum up the probabilities of all reachable states that have 19 or less cars in C2 (states that)
            #States that are below the initial state cant be reached and can therefore be dismissed, except the number of requests or actions is big enough
            #e.g. its only possible to start with 18 cars and end up with 15 cars if there are at least 3 requests, or if at least 3 cars are removed overnight, or a combination of both
            while i<=(state2.c1-state1.c1+(requestReward-n)-action):
                inverseProbabilityC1 += returnAtLocation1(maxCars-state1.c1+(requestReward-n)-action-i)
                i += 1
            probability += (requestAtLocation1(requestReward-n)-requestAtLocation1(requestReward-n)*inverseProbabilityC1)*requestAtLocation2(n)*returnAtLocation2(state2.c2-state1.c2+n+action)
        n += 1
        i = 1
        
    return probability

def probMaxC1C2(state2, reward, state1, action):
    """
    Calculates the probability of transitioning from one state to a target
    state where state2.c1 = maxCars AND state2.c2 = maxCars.
    
    This function should not be called directly, as it is called by the
    prob-function in appropriate cases.
    
    Args:
        state2 (state): the state (comprised of the values c1 and c2) the transition is TO
        reward (float): the reward DIVIDED BY 10 that the transition is supposed to give. This means a request counts as 1 reward and the cost of moving a car is 0.2 reward. The reward is the sum of the money received from requests the next day, minus the cost of moving cars during the night between state1 and state2)
        state1 (state): the state the transition is FROM
        action (int): an integer between -5 and 5 which signifies the number of cars moved. Positive numbers: cars moved from c1 to c2. Negative numbers: cars moved from c2 to c1. E.g. -3 = 3 cars moved overnight from c2 to c1. 0 Means no cars moved.
        
    Returns:
        float: probability of the transition
    """
    probability = float(0)
    requestReward = reward + abs(action)*0.2
    if requestReward%1 > 0.01:
        return 0.0
    n = 0
    i = 1 #counter that counts down to all reachable states that are below the desired state maxCars
    j = 1
    while (requestReward-n)>=0:
        if((requestReward-n)<=(state1.c1+action) and n<=(state1.c2-action)):
            #print("enough cars")
            inverseProbabilityC1 = 0
            #Sum up the probabilities of all reachable states that have 19 or less cars in C2 (states that)
            #States that are below the initial state cant be reached and can therefore be dismissed, except the number of requests or actions is big enough
            #e.g. its only possible to start with 18 cars and end up with 15 cars if there are at least 3 requests, or if at least 3 cars are removed overnight, or a combination of both
            while i<=(state2.c1-state1.c1+(requestReward-n)-action):
                inverseProbabilityC1 += returnAtLocation1(maxCars-state1.c1+(requestReward-n)-action-i)
                i += 1
            #The aggregated probabilities of all states that have 19 or less cars in C2
            inverseProbabilityC2 = 0
            #Sum up the probabilities of all reachable states that have 19 or less cars in C2 (states that)
            #States that are below the initial state cant be reached and can therefore be dismissed, except the number of requests or actions is big enough
            #e.g. its only possible to start with 18 cars and end up with 15 cars if there are at least 3 requests, or if at least 3 cars are removed overnight, or a combination of both
            while j<=(state2.c2-state1.c2+n+action):
                inverseProbabilityC2 += returnAtLocation2(maxCars-state1.c2+n+action-i)
                j += 1
            probability += (requestAtLocation1(requestReward-n)-requestAtLocation1(requestReward-n)*inverseProbabilityC1)*(requestAtLocation2(n)-requestAtLocation2(n)*inverseProbabilityC2)
        n += 1
        i = 1
        
    return probability

class environment:
    """
    Complete information environment class with attributes that fully define the
    environment. The environment is a Markov decision process.
    
    env() should be used to initialize an environment object according to the
    Jack's Car Rental excercise.
    
    Attributes:
        P[s][a] is a list of transition tuples (prob, next_state, reward, done).
        nS is a number of states in the environment. 
        nA is a number of actions in the environment.
        shape[] is optional for visualization purposes. It is a list of integers representing the edge lengths of a matrix that contains the states. E.g. if the states are best mapped on a 21x21 matrix, the list should state [21, 21]
    """
    def __init__(self, P, nS, nA):
        self.P = P
        self.nS = nS
        self.nA = nA
        self.shape = [nrOfStates, nrOfStates]

def env():
    """
    Generates an environment according to the world of Jack's Car Rental.
    It contains a list of transition tuples (ALL possible transitions defined
    by all possible combinations of states, rewards and actions).
    
    This function can have long run times as it has big complexity (n^5)*x
    where n is the maximum number of cars at one station and x is the runtime
    of the prob function, which itself is not cheap and is called at every step.
    
    Returns:
        env: the complete environment with values for P, nS and nA.
    """
    precision = 0.00001 # 0 = infinite precision, 0.00001 = good precision, 0.0001 = result is definitely wrong in some cases
    
    P = [[0 for y in range(11)] for x in range(nrOfStates*nrOfStates)]
    #state1.c1
    for i in range(nrOfStates): 
        #state1.c2
        for j in range(nrOfStates):
            print("Generating list of transition tuples, i: " + str(i) + ", j: " + str(j))
            #action (cars moved from c1 to c2)
            for o in range(-5, 6):
                #print("Creating swell transition list: state " + str(i) + ", " + str(j) + " and action " + str(o))
                thislist = []
                #state2.c1
                for k in range(nrOfStates): 
                    #state2.c2
                    for l in range(nrOfStates):
                        #request reward:
                        for m in range(0, i+j+1):
                            prob1 = prob(state(k, l), m-0.2*abs(o), state(i,j), o)
                            #the following if-statement compresses the transition list by not adding probabilities below a threshold; optimality is no longer guaranteed
                            if(prob1>precision):
                                thislist.append([prob1, k*nrOfStates+l, m-0.2*abs(o), False])
                            
                P[i*nrOfStates+j][o+5] = thislist
                #print(thislist)
            
    env = environment(P, nrOfStates*nrOfStates, 11)
    return env




