----------------------------------------------------------------
---------------------EDIT BY: SkipS#1234
----------------------------------------------------------------
local Tunnel = module("vrp","lib/Tunnel")
local Proxy = module("vrp","lib/Proxy")
vRP = Proxy.getInterface("vRP")
vRPclient = Tunnel.getInterface("vRP")

-- Configuração dos itens (spawn names no inventário)
-- Baseado na lista enviada pelo usuário
local config = {
    permission = "policia.permissao",
    items = {
        -- Pistolas
        ["appistol"] = { item = "wbody|WEAPON_APPISTOL", ammo = "wammo|WEAPON_APPISTOL" },
        ["m1911"] = { item = "wbody|WEAPON_PISTOL", ammo = "wammo|WEAPON_PISTOL" },
        ["fiveseven"] = { item = "wbody|WEAPON_PISTOL_MK2", ammo = "wammo|WEAPON_PISTOL_MK2" },
        ["desert"] = { item = "wbody|WEAPON_PISTOL50", ammo = "wammo|WEAPON_PISTOL50" },
        ["glock19"] = { item = "wbody|WEAPON_COMBATPISTOL", ammo = "wammo|WEAPON_COMBATPISTOL" },
        ["amt380"] = { item = "wbody|WEAPON_SNSPISTOL", ammo = "wammo|WEAPON_SNSPISTOL" },
        ["m1922"] = { item = "wbody|WEAPON_VINTAGEPISTOL", ammo = "wammo|WEAPON_VINTAGEPISTOL" },
        ["magnum44"] = { item = "wbody|WEAPON_REVOLVER", ammo = "wammo|WEAPON_REVOLVER" },
        
        -- SMGs
        ["uzi"] = { item = "wbody|WEAPON_MICROSMG", ammo = "wammo|WEAPON_MICROSMG" },
        ["smg"] = { item = "wbody|WEAPON_SMG", ammo = "wammo|WEAPON_SMG" },
        ["mtar21"] = { item = "wbody|WEAPON_ASSAULTSMG", ammo = "wammo|WEAPON_ASSAULTSMG" },
        ["tec9"] = { item = "wbody|WEAPON_MACHINEPISTOL", ammo = "wammo|WEAPON_MACHINEPISTOL" },
        
        -- Rifles / Shotguns
        ["remington"] = { item = "wbody|WEAPON_PUMPSHOTGUN", ammo = "wammo|WEAPON_PUMPSHOTGUN" },
        ["m4a1"] = { item = "wbody|WEAPON_CARBINERIFLE", ammo = "wammo|WEAPON_CARBINERIFLE" },
        ["ak47"] = { item = "wbody|WEAPON_ASSAULTRIFLE", ammo = "wammo|WEAPON_ASSAULTRIFLE" },
        ["thompson"] = { item = "wbody|WEAPON_GUSENBERG", ammo = "wammo|WEAPON_GUSENBERG" },
        ["g36c"] = { item = "wbody|WEAPON_SPECIALCARBINE_MK2", ammo = "wammo|WEAPON_SPECIALCARBINE_MK2" },
        ["Sniper"] = { item = "wbody|WEAPON_HEAVYSNIPER_MK2", ammo = "wammo|WEAPON_HEAVYSNIPER_MK2" },

        -- Utilitários
        ["stungun"] = { item = "wbody|WEAPON_STUNGUN" },
        ["extintor"] = { item = "wbody|WEAPON_FIREEXTINGUISHER" },
        ["combustivel"] = { item = "wbody|WEAPON_PETROLCAN" },
        ["winchester22"] = { item = "wbody|WEAPON_MUSKET", ammo = "wammo|WEAPON_MUSKET" },
        ["raypistol"] = { item = "wbody|WEAPON_RAYPISTOL" }
    }
}

-- Verifica permissão para abrir o arsenal
RegisterServerEvent('ndk:permissao')
AddEventHandler('ndk:permissao', function()
    local src = source
    local user_id = vRP.getUserId(src)
    if user_id then
        if vRP.hasPermission(user_id, config.permission) then
            TriggerClientEvent('ndk:permissao', src)
        else
            TriggerClientEvent("Notify", src, "negado", "Você não tem permissão para acessar o arsenal.")
        end
    end
end)

-- Evento para entregar ARMA como item
RegisterServerEvent('skips_arsenal:giveWeapon')
AddEventHandler('skips_arsenal:giveWeapon', function(weapon_id)
    local src = source
    local user_id = vRP.getUserId(src)
    if user_id and vRP.hasPermission(user_id, config.permission) then
        local weapon_data = config.items[weapon_id]
        if weapon_data then
            local item_name = weapon_data.item
            -- Verifica peso do inventário antes de dar o item
            if (vRP.getInventoryWeight(user_id) + vRP.getItemWeight(item_name)) <= vRP.getInventoryMaxWeight(user_id) then
                vRP.giveInventoryItem(user_id, item_name, 1)
                TriggerClientEvent("Notify", src, "sucesso", "Você pegou uma arma.")
            else
                TriggerClientEvent("Notify", src, "negado", "Inventário cheio.")
            end
        end
    end
end)

-- Evento para entregar MUNIÇÃO como item
RegisterServerEvent('skips_arsenal:giveAmmo')
AddEventHandler('skips_arsenal:giveAmmo', function(weapon_id)
    local src = source
    local user_id = vRP.getUserId(src)
    if user_id and vRP.hasPermission(user_id, config.permission) then
        local weapon_data = config.items[weapon_id]
        if weapon_data and weapon_data.ammo then
            local ammo_item = weapon_data.ammo
            local amount = 50 -- Quantidade padrão de munição por clique
            
            if (vRP.getInventoryWeight(user_id) + (vRP.getItemWeight(ammo_item) * amount)) <= vRP.getInventoryMaxWeight(user_id) then
                vRP.giveInventoryItem(user_id, ammo_item, amount)
                TriggerClientEvent("Notify", src, "sucesso", "Você pegou munição.")
            else
                TriggerClientEvent("Notify", src, "negado", "Inventário cheio.")
            end
        end
    end
end)

-- Evento do colete
RegisterServerEvent('skips_arsenal:colete')
AddEventHandler('skips_arsenal:colete', function()
    local src = source
    local user_id = vRP.getUserId(src)
    if user_id and vRP.hasPermission(user_id, config.permission) then
        vRPclient.setArmour(src, 100)
        vRP.setUData(user_id, "vRP:colete", json.encode(100))
        TriggerClientEvent("Notify", src, "sucesso", "Você equipou o colete.")
    end
end)
