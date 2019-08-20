# -*- coding: utf-8 -*-
"""
Created on Mon Jun 10 17:30:57 2019

@author: dennybritz, FritzD
"""

import time
import numpy as np
import CarRentalEnvironment as jack
import matplotlib.pyplot as plt

plt.rcParams.update({'font.size': 22})
  
start_time = time.time()
print("start!")


#env = GridworldEnv()
env = jack.env()

env_time = time.time()
iterationCount = 1
print("Run time of transition list generation = {}s".format(env_time-start_time))

# Taken from Policy Evaluation Exercise!

def policy_eval(policy, env, discount_factor, theta=0.00001): #original theta value theta=0.00001
    """
    Evaluate a policy given an environment and a full description of the environment's dynamics.
    
    Args:
        policy: [S, A] shaped matrix representing the policy.
        env: OpenAI env. env.P represents the transition probabilities of the environment.
            env.P[s][a] is a list of transition tuples (prob, next_state, reward, done).
            env.nS is a number of states in the environment. 
            env.nA is a number of actions in the environment.
        theta: We stop evaluation once our value function change is less than theta for all states.
        discount_factor: Gamma discount factor.
    
    Returns:
        Vector of length env.nS representing the value function.
    """
    
    # Some visualization of the policy iteration steps
    global iterationCount
    print("evaluating policy iteration " + str(iterationCount) + ", discount factor = " + str(discount_factor) + ", theta = " + str(theta))
    print("Policy:")    
    visualizePretty(np.reshape(np.argmax(policy, axis=1)-5, env.shape), "policy")
    print("")
    iterationCount += 1
    ##
    
    # Start with a random (all 0) value function
    V = np.full(env.nS, 0, float) # was originally: V = np.zeros(env.nS)
    while True:
        delta = 0
        for s in range(env.nS):
            v = 0
            # Look at the possible next actions
            for a, action_prob in enumerate(policy[s]):
                # For each action, look at the possible next states...
                #for tupel in env.P[s][a]:
                for  prob, next_state, reward, done in env.P[s][a]:
                        #for  prob, next_state, reward, done in tupel:
                        # Calculate the expected value
                        v += action_prob * prob * (reward + discount_factor * V[next_state])
            # How much our value function changed (across any states)
            delta = max(delta, np.abs(v - V[s]))
            V[s] = v
        # Stop evaluating once our value function change is below a threshold
        if delta < theta:
            break
    return np.array(V)

def policy_improvement(env, discount_factor, theta=0.00001, policy_eval_fn=policy_eval):
    """
    Policy Improvement Algorithm. Iteratively evaluates and improves a policy
    until an optimal policy is found.
    
    Args:
        env: The OpenAI environment.
        policy_eval_fn: Policy Evaluation function that takes 3 arguments:
            policy, env, discount_factor.
        discount_factor: gamma discount factor.
        
    Returns:
        A tuple (policy, V). 
        policy is the optimal policy, a matrix of shape [S, A] where each state s
        contains a valid probability distribution over actions.
        V is the value function for the optimal policy.
        
    """

    def one_step_lookahead(state, V):
        """
        Helper function to calculate the value for all action in a given state.
        
        Args:
            state: The state to consider (int)
            V: The value to use as an estimator, Vector of length env.nS
        
        Returns:
            A vector of length env.nA containing the expected value of each action.
        """
        A = np.zeros(env.nA)
        for a in range(env.nA):
            for prob, next_state, reward, done in env.P[state][a]:
                A[a] += prob * (reward + discount_factor * V[next_state])
        return A
    
    # Start with a random policy
    policy = np.ones([env.nS, env.nA]) / env.nA
    
    while True:
        # Evaluate the current policy
        V = policy_eval_fn(policy, env, discount_factor, theta)
        
        # Will be set to false if we make any changes to the policy
        policy_stable = True
        
        # For each state...
        for s in range(env.nS):
            # The best action we would take under the currect policy
            chosen_a = np.argmax(policy[s])
            
            # Find the best action by one-step lookahead
            # Ties are resolved arbitarily
            action_values = one_step_lookahead(s, V)
            best_a = np.argmax(action_values)
            
            # Greedily update the policy
            if chosen_a != best_a:
                policy_stable = False
            policy[s] = np.eye(env.nA)[best_a]
        
        # If the policy is stable we've found an optimal policy. Return it
        if policy_stable:
            return policy, V
        
def visualize(number):
    """
    A function that visualizes the value of a number with a character, ASCII style
    """
    number = abs(number)
    if number < 1:
        return " "
    if number < 2:
        return "-"
    if number < 3:
        return "="
    if number < 4:
        return "≡"
    if number < 5:
        return "▒"
    if number < 6:
        return "▓"
    if number < 7:
        return "█"
    if number < 8:
        return "█"
    return "█"

def visualizePretty(array, title="title goes here"):
    ## 
    dim_1, dim_2 = array.shape
    fig, ax = plt.subplots(figsize=(7,7))
    im = ax.imshow(array)
    
    # Loop over data dimensions and create text annotations.
    for i in range(dim_1):
        for j in range(dim_2):
            text = ax.text(j, i, array[i, j],
                           ha="center", va="center", color="w")
    
    ax.set_title(title)
    fig.tight_layout()
    plt.show()
    ##


    
       
#policy, v = policy_improvement(env, 0, 1)
policy, v = policy_improvement(env, 0.9, 0.00001)

iteration_time = time.time()
print("Run time of policy iteration = {} sec".format(iteration_time-env_time))

print("Policy Probability Distribution:")
print(policy)
print("")

print("Reshaped Policy (-5 = move 5 cars from B to A, 0 = move no cars, 5 = move 5 cars from A to B):")
#print("(not implemented)")
print(np.reshape(np.argmax(policy, axis=1)-5, env.shape))
print("")



print("Visualized Policy:")
#print("(not implemented)")
list1 = []
for number in np.argmax(policy, axis=1):    
    list1.append(visualize(number-5))
print(str(np.reshape(list1, env.shape)).replace("'", ""))
print("")

print("visualizePretty:")
visualizePretty(np.reshape(np.argmax(policy, axis=1)-5, env.shape), "policy")

print("Value Function:")
print(v)
print("")

print("Reshaped Grid Value Function:")
#print("(not implemented)")
list3 = []
for number in v:    
    list3.append(round(number, 3))
#print("(not implemented)")
print(str(np.reshape(list3, env.shape)).replace("'", ""))
print("")

print("Visualized Value Function:")
list2 = []
for number in v:    
    list2.append(visualize(number))
#print("(not implemented)")
print(str(np.reshape(list2, env.shape)).replace("'", ""))
print("")

print("visualizePretty:")
visualizePretty(np.reshape(v, env.shape), "value function")

end_time = time.time()

print("Run time total = {} sec".format(end_time - start_time))
print("Run time of transition list generation = {} sec".format(env_time-start_time))
print("Run time of policy iteration = {} sec".format(iteration_time-env_time))